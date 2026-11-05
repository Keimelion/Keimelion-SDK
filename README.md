# @keimelion/sdk

Official TypeScript SDK for the [Keimelion](https://keimelion.com) API.

It is the **single source of truth for the API contract**: request and response Zod schemas,
enums, error codes and a typed `fetch`-based HTTP client. The API itself imports its contract
schemas from this package, and every consumer (frontend, Chrome extension, back-office)
installs it from npm.

| Subpath | Content |
|---|---|
| `@keimelion/sdk/schemas` | Zod request / response schemas + their `XInput` / `XParsed` types, shared primitives (pagination, password, username, slug, url, currency, sort), error envelope, refine messages |
| `@keimelion/sdk/enums` | `ErrorCode`, `HttpStatus`, `HttpMethod`, `HttpHeader` and every domain enum (`UserRoles`, `ItemStatuses`, `SupportedCurrencies`…) |
| `@keimelion/sdk/client` | `createClient`, `ApiError`, `HttpClient` |

Admin endpoints will live under `client.admin.*` in the same client (no separate subpath).

Runs in browsers, Node.js ≥ 20 and MV3 service workers: the sources never import Node-only
modules, an ORM, an HTTP framework or a DB driver (enforced by ESLint in CI).

## Install

```bash
npm install @keimelion/sdk zod
```

`zod` (`^4.5.0`) is a **peer dependency**: it is never bundled, your app provides it.
The package is public on npmjs — no registry token, `.npmrc` or build secret is needed.

## Usage

```ts
import { ApiError, createClient } from '@keimelion/sdk/client'
import { ErrorCode } from '@keimelion/sdk/enums'

const client = createClient({
  baseUrl: 'https://api.keimelion.com',
  getToken: async () => (await storage.get('accessToken')) ?? null,
  // fetch: customFetch, // optional, defaults to globalThis.fetch
})

try {
  const { accessToken, refreshToken, user } = await client.auth.login({
    email: 'jane@example.com',
    password: 'secret',
  })
  user.createdAt // Date — ISO timestamps are decoded into Date objects

  const rotated = await client.auth.refresh({ refreshToken })
  await client.auth.logout({ refreshToken: rotated.refreshToken })
} catch (error) {
  if (error instanceof ApiError && error.code === ErrorCode.UNPROCESSABLE_ENTITY) {
    console.log(error.status, error.message, error.issues) // [{ path, message, code }]
  }
  throw error
}
```

- `getToken` may be sync or async; when it returns `null` no `Authorization` header is sent.
- Requests are **not** validated client-side (the API is the authority). Responses are parsed
  with the SDK schema: a body that does not match throws `ApiError` with
  `code: 'INVALID_RESPONSE'` (`ClientErrorCode.INVALID_RESPONSE`), the Zod error as `cause`.
- Any API error (`{ message, code, metadata }`) throws `ApiError` exposing `status`, `code`,
  `message`, `metadata` and `issues` (`metadata.issues` of a 422, `[]` otherwise).
- There is no automatic refresh / 401 interceptor in 0.x yet: call `client.auth.refresh()`
  yourself when an access token expires.

### Using the schemas

```ts
import { loginResponseSchema, type LoginRequestInput } from '@keimelion/sdk/schemas'

const session = loginResponseSchema.parse(json) // session.user.createdAt is a Date
```

## Contract conventions

- Every schema exports **two types** next to it: `XInput = z.input<typeof xSchema>` (what a
  caller sends / what is on the wire) and `XParsed = z.output<typeof xSchema>` (what the API
  handler receives / what the client returns). CI fails if one is missing.
- Response schemas are plain `z.object` (unknown keys are **stripped**, not rejected), so
  additive API fields are non-breaking for older clients. Adding an **enum value** is not:
  it requires an SDK release before the API starts sending it.
- Timestamps use a codec: ISO string on the wire ↔ `Date` once parsed.
- Postgres `numeric` columns (prices, FX rates) are **strings** on the wire, never numbers.
- Response schemas never declare internal columns (password / token hashes, internal
  tokens).
- Enums are defined here and the API derives its `pgEnum`s from them: **changing an enum
  requires a paired DB migration in Keimelion-API**.

## SDK first, then the API

Any change to an API request or response shape is made **in this repo first**:

1. SDK PR (schemas + client method + tests) → merged into `dev` → released to npm.
2. API PR bumps `@keimelion/sdk` to the released version and adapts the endpoint.

The API types its mappers on the SDK output types and asserts each happy-path response with
`schema.parse(...)` in its tests, so a drift fails `tsc` or the test suite.

## Local development with yalc

To develop the SDK and a consumer side by side without publishing:

```bash
# in Keimelion-SDK
npm run build && npx yalc publish     # once
npm run dev                           # tsup --watch, `yalc push` after each build

# in the consumer (Keimelion-API, frontend…)
npx yalc link @keimelion/sdk          # symlink, package.json and lockfile untouched
npm ci                                # back to the registry version when done
```

Always use `yalc link`, **never `yalc add`**: `add` rewrites `package.json` to
`file:.yalc/...` and breaks `npm ci` in CI. Consumers gitignore `.yalc/` and `yalc.lock`, and
a husky `pre-commit` hook rejects a `file:.yalc` dependency or a staged `yalc.lock`.

## Scripts

| Script | Role |
|---|---|
| `npm run build` | `tsup` (ESM + CJS + `.d.ts`), then zod-not-bundled check, `publint --strict`, `attw` |
| `npm run lint` | ESLint (strict + stylistic type-checked, Node/server import guard) + schema type-export check |
| `npm run typecheck` | `tsc --noEmit` (strict, no `@types/node`) |
| `npm test` | Vitest |
| `npm run test:pack [dir]` | `npm pack`, install the tarball + zod in a scratch project, import every subpath from ESM and CJS and type-check both |

## Release

Same pipeline as every Keimelion repo (reusable workflows of
[Keimelion-Infra](https://github.com/Keimelion/Keimelion-Infra), see its
`docs/release-process.md`): feature PRs are squash-merged into `dev` with a Conventional
Commit title; a `dev → main` release PR (merge commit) triggers CI → semantic-release
(tag, GitHub Release, `CHANGELOG.md`) → **npm-publish** (only when a version was tagged):
build, `publint`, `attw`, `npm publish --provenance --access public`.

The package is in **0.x**: a breaking change bumps the minor version (`0.1.0 → 0.2.0`), so
consumers should depend on `^0.x.0`.
