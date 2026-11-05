import { builtinModules } from 'node:module'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

const SERVER_ONLY_PACKAGES = ['drizzle-orm', 'hono', 'postgres', 'pg']

const NODE_BUILTIN_MODULES = builtinModules.flatMap((name) =>
  name.startsWith('node:') ? [name] : [name, `node:${name}`],
)

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: NODE_BUILTIN_MODULES.map((name) => ({
            name,
            message: 'The SDK runs in browsers and MV3 service workers: Node-only modules are forbidden.',
          })),
          patterns: [
            {
              group: SERVER_ONLY_PACKAGES.flatMap((name) => [name, `${name}/*`]),
              message: 'The SDK must not depend on server-only packages (ORM, HTTP framework, DB driver).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly' },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'CHANGELOG.md'],
  },
)
