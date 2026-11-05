import { describe, expect, it } from 'vitest'
import { ApiError, ClientErrorCode } from '../../../src/client/_core/api-error.js'
import { AuthPaths } from '../../../src/client/auth/auth.paths.js'
import { createClient } from '../../../src/client/create-client.js'
import { buildUserDetailWire, CREATED_AT_ISO } from '../../fixtures.js'
import { jsonResponse, mockFetchResponse, recordedHeaders } from '../fetch-mock.js'

const BASE_URL = 'https://api.example.com'

describe('client.auth', () => {
  it('login posts the credentials and returns the decoded session', async () => {
    const wire = { accessToken: 'access', refreshToken: 'refresh', user: buildUserDetailWire() }
    const { fetch, calls } = mockFetchResponse(jsonResponse(wire))
    const client = createClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const session = await client.auth.login({ email: 'jane@example.com', password: 'secret' })

    expect(calls[0]?.url).toBe(`${BASE_URL}${AuthPaths.LOGIN}`)
    expect(JSON.parse(calls[0]?.init.body as string)).toEqual({
      email: 'jane@example.com',
      password: 'secret',
    })
    expect(session.accessToken).toBe('access')
    expect(session.refreshToken).toBe('refresh')
    expect(session.user.createdAt).toEqual(new Date(CREATED_AT_ISO))
  })

  it('login throws INVALID_RESPONSE on a malformed body', async () => {
    const { fetch } = mockFetchResponse(jsonResponse({ accessToken: 'access' }))
    const client = createClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error: unknown = await client.auth
      .login({ email: 'jane@example.com', password: 'secret' })
      .catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).code).toBe(ClientErrorCode.INVALID_RESPONSE)
  })

  it('refresh posts the refresh token in the JSON body', async () => {
    const { fetch, calls } = mockFetchResponse(
      jsonResponse({ accessToken: 'a2', refreshToken: 'r2' }),
    )
    const client = createClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const tokens = await client.auth.refresh({ refreshToken: 'r1' })

    expect(calls[0]?.url).toBe(`${BASE_URL}${AuthPaths.REFRESH}`)
    expect(JSON.parse(calls[0]?.init.body as string)).toEqual({ refreshToken: 'r1' })
    expect(tokens).toEqual({ accessToken: 'a2', refreshToken: 'r2' })
  })

  it('refresh never sends the (possibly expired) access token: the route is public', async () => {
    const { fetch, calls } = mockFetchResponse(
      jsonResponse({ accessToken: 'a2', refreshToken: 'r2' }),
    )
    const client = createClient({ baseUrl: BASE_URL, getToken: () => 'expired-jwt', fetch })

    await client.auth.refresh({ refreshToken: 'r1' })

    expect(recordedHeaders(calls[0])).not.toHaveProperty('Authorization')
  })

  it('logout carries the Bearer token from an async getToken and an empty JSON body', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ message: 'Logged out successfully' }))
    const client = createClient({
      baseUrl: BASE_URL,
      getToken: () => Promise.resolve('jwt-123'),
      fetch,
    })

    const result = await client.auth.logout()

    expect(calls[0]?.url).toBe(`${BASE_URL}${AuthPaths.LOGOUT}`)
    expect(recordedHeaders(calls[0]).Authorization).toBe('Bearer jwt-123')
    expect(calls[0]?.init.body).toBe('{}')
    expect(result).toEqual({ message: 'Logged out successfully' })
  })

  it('logout sends no Authorization header when getToken resolves null', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ message: 'ok' }))
    const client = createClient({ baseUrl: BASE_URL, getToken: () => Promise.resolve(null), fetch })

    await client.auth.logout({ refreshToken: 'r1' })

    expect(recordedHeaders(calls[0])).not.toHaveProperty('Authorization')
    expect(JSON.parse(calls[0]?.init.body as string)).toEqual({ refreshToken: 'r1' })
  })

  it('routes the remaining auth calls to their endpoints', async () => {
    const message = { message: 'ok' }
    const cases = [
      {
        call: (client: ReturnType<typeof createClient>) => client.auth.verifyEmail({ token: 'x' }),
        path: AuthPaths.VERIFY_EMAIL,
      },
      {
        call: (client: ReturnType<typeof createClient>) =>
          client.auth.forgotPassword({ email: 'a@b.co' }),
        path: AuthPaths.FORGOT_PASSWORD,
      },
      {
        call: (client: ReturnType<typeof createClient>) =>
          client.auth.resetPassword({ passwordResetToken: 't', password: 'password1' }),
        path: AuthPaths.RESET_PASSWORD,
      },
    ]

    const urls = await Promise.all(
      cases.map(async ({ call }) => {
        const { fetch, calls } = mockFetchResponse(jsonResponse(message))
        await call(createClient({ baseUrl: BASE_URL, getToken: () => null, fetch }))
        return calls[0]?.url
      }),
    )

    expect(urls).toEqual(cases.map(({ path }) => `${BASE_URL}${path}`))
  })

  it('register returns the decoded user and refresh token', async () => {
    const { fetch, calls } = mockFetchResponse(
      jsonResponse({ user: buildUserDetailWire(), refreshToken: 'r1' }, 201),
    )
    const client = createClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const result = await client.auth.register({ email: 'jane@example.com', password: 'password1' })

    expect(calls[0]?.url).toBe(`${BASE_URL}${AuthPaths.REGISTER}`)
    expect(result.user.emailVerifiedAt).toBeInstanceOf(Date)
    expect(result.refreshToken).toBe('r1')
  })
})
