import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST_DIR = 'dist'
const ZOD_INTERNAL_MARKERS = ['$constructor(', 'class ZodError', '$ZodType']
const JS_EXTENSIONS = ['.js']

const bundledFiles = listFiles(DIST_DIR)
  .filter((file) => JS_EXTENSIONS.some((extension) => file.endsWith(extension)))
  .filter((file) => {
    const content = readFileSync(file, 'utf8')
    return ZOD_INTERNAL_MARKERS.some((marker) => content.includes(marker))
  })

if (bundledFiles.length > 0) {
  console.error(
    `zod must stay an external peer dependency, found bundled in:\n${bundledFiles.join('\n')}`,
  )
  process.exit(1)
}
console.log('dist: zod is external (not bundled)')

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? listFiles(path) : [path]
  })
}
