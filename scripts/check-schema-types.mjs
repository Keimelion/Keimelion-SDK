import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SCHEMAS_DIR = 'src/schemas'
const SCHEMA_EXPORT_REGEX = /export (?:const|function) (\w+?)Schema\b/g

const missing = listFiles(SCHEMAS_DIR)
  .filter((file) => file.endsWith('.ts') && !file.endsWith('index.ts'))
  .flatMap((file) => findMissingTypeExports(file))

if (missing.length > 0) {
  console.error(
    `Every exported schema must export its XInput and XParsed types:\n${missing.join('\n')}`,
  )
  process.exit(1)
}
console.log('schemas: every exported schema exports XInput + XParsed')

function findMissingTypeExports(file) {
  const source = readFileSync(file, 'utf8')
  return [...source.matchAll(SCHEMA_EXPORT_REGEX)]
    .map((match) => toTypeBaseName(match[1]))
    .flatMap((baseName) => [`${baseName}Input`, `${baseName}Parsed`])
    .filter((typeName) => !new RegExp(`export type ${typeName}\\b`).test(source))
    .map((typeName) => `${file}: missing export type ${typeName}`)
}

function toTypeBaseName(schemaPrefix) {
  const withoutFactoryVerb = schemaPrefix.replace(/^create(?=[A-Z])/, '')
  return withoutFactoryVerb.charAt(0).toUpperCase() + withoutFactoryVerb.slice(1)
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })
}
