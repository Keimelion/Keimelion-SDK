import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'schemas/index': 'src/schemas/index.ts',
    'enums/index': 'src/enums/index.ts',
    'client/index': 'src/client/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  platform: 'neutral',
  external: ['zod'],
  treeshake: true,
})
