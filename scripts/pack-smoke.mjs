import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const SUBPATHS = ['schemas', 'enums', 'client']
const PROBES = {
  schemas: 'loginResponseSchema',
  enums: 'ErrorCode',
  client: 'createClient',
}

const packageRoot = resolve(import.meta.dirname, '..')
const scratchDir = process.argv[2]
  ? resolve(process.argv[2])
  : mkdtempSync(join(tmpdir(), 'keimelion-sdk-smoke-'))
mkdirSync(scratchDir, { recursive: true })

const tarball = run('npm', ['pack', '--silent', '--pack-destination', scratchDir], packageRoot)
  .trim()
  .split('\n')
  .pop()
writeFileSync(
  join(scratchDir, 'package.json'),
  JSON.stringify({ name: 'sdk-smoke', private: true }, null, 2),
)
run(
  'npm',
  ['install', '--no-audit', '--no-fund', '--silent', join(scratchDir, tarball), 'zod@^4.5.0'],
  scratchDir,
)

writeFileSync(
  join(scratchDir, 'esm.mjs'),
  buildRuntimeProbe((subpath) => `import { ${PROBES[subpath]} } from '@keimelion/sdk/${subpath}'`),
)
writeFileSync(
  join(scratchDir, 'cjs.cjs'),
  buildRuntimeProbe(
    (subpath) => `const { ${PROBES[subpath]} } = require('@keimelion/sdk/${subpath}')`,
  ),
)
writeFileSync(join(scratchDir, 'types.mts'), buildTypeProbe())
writeFileSync(join(scratchDir, 'types.cts'), buildTypeProbe())

console.log(run('node', ['esm.mjs'], scratchDir).trim())
console.log(run('node', ['cjs.cjs'], scratchDir).trim())
const tsc = join(packageRoot, 'node_modules', 'typescript', 'bin', 'tsc')
run(
  'node',
  [
    tsc,
    '--noEmit',
    '--strict',
    '--module',
    'nodenext',
    '--moduleResolution',
    'nodenext',
    '--target',
    'es2022',
    '--lib',
    'es2022,dom',
    'types.mts',
    'types.cts',
  ],
  scratchDir,
)
console.log('types: ESM (.mts) and CJS (.cts) consumers type-check against the tarball')
console.log(`pack smoke OK (${tarball}) in ${scratchDir}`)

function buildRuntimeProbe(importLine) {
  const imports = SUBPATHS.map(importLine).join('\n')
  const checks = SUBPATHS.map(
    (subpath) =>
      `if (${PROBES[subpath]} === undefined) throw new Error('${subpath} did not resolve')`,
  ).join('\n')
  return `${imports}\n${checks}\nconsole.log('runtime: ' + ${JSON.stringify(SUBPATHS.join(', '))} + ' resolved')\n`
}

function buildTypeProbe() {
  return `import { loginResponseSchema, type LoginResponseParsed } from '@keimelion/sdk/schemas'
import { ErrorCode } from '@keimelion/sdk/enums'
import { createClient, ApiError } from '@keimelion/sdk/client'

const client = createClient({ baseUrl: 'https://api.example.com', getToken: async () => null })
const loginCall: Promise<LoginResponseParsed> = client.auth.login({ email: 'a@b.co', password: 'x' })
const createdAt: Date | undefined = loginResponseSchema.safeParse({}).data?.user.createdAt
const unauthorized: 'UNAUTHORIZED' = ErrorCode.UNAUTHORIZED
export const probes = [loginCall, createdAt, unauthorized, ApiError]
`
}

function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })
}
