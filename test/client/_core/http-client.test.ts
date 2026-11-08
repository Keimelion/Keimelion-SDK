import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { ApiError, ClientErrorCode } from '../../../src/client/_core/api-error.js'
import type { ApiErrorCode } from '../../../src/client/_core/api-error.js'
import { createHttpClient, RequestAuthMode } from '../../../src/client/_core/http-client.js'
import { ErrorCode } from '../../../src/enums/error-code.js'
import { HttpMethod, HttpStatus } from '../../../src/enums/http.js'
import { noContentResponseSchema } from '../../../src/schemas/_shared/no-content.js'
import {
  jsonResponse,
  mockFetchHandler,
  mockFetchResponse,
  recordedHeaders,
} from '../fetch-mock.js'

const BASE_URL = 'https://api.example.com'
const pingSchema = z.object({ pong: z.boolean() })

// Never resolves on its own: settles only when the request signal aborts, like a real fetch
// (which also rejects straight away when the signal is already aborted).
function hangingFetch(_url: string, init: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    const signal = init.signal
    const rejectWithReason = (): void => {
      reject(signal?.reason instanceof Error ? signal.reason : new Error('aborted'))
    }
    if (signal?.aborted) {
      rejectWithReason()
      return
    }
    signal?.addEventListener('abort', rejectWithReason)
  })
}

async function captureError(promise: Promise<unknown>): Promise<ApiError> {
  const error: unknown = await promise.catch((caught: unknown) => caught)
  if (!(error instanceof ApiError)) throw new Error('Expected an ApiError')
  return error
}

describe('createHttpClient', () => {
  it('joins the base URL, sends a JSON body and parses the response', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true, extra: 1 }))
    const http = createHttpClient({ baseUrl: `${BASE_URL}//`, getToken: () => null, fetch })

    const result = await http.request({
      method: HttpMethod.POST,
      path: '/v1/ping',
      body: { a: 1 },
      responseSchema: pingSchema,
    })

    expect(result).toEqual({ pong: true })
    expect(calls[0]?.url).toBe(`${BASE_URL}/v1/ping`)
    expect(calls[0]?.init.method).toBe('POST')
    expect(calls[0]?.init.body).toBe('{"a":1}')
    expect(recordedHeaders(calls[0])['Content-Type']).toBe('application/json')
  })

  it('omits the body and Content-Type when there is no body', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema })

    expect(calls[0]?.init.body).toBeUndefined()
    expect(recordedHeaders(calls[0])).not.toHaveProperty('Content-Type')
  })

  it('attaches the Bearer token resolved by an async getToken', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({
      baseUrl: BASE_URL,
      getToken: () => Promise.resolve('jwt-123'),
      fetch,
    })

    await http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema })

    expect(recordedHeaders(calls[0]).Authorization).toBe('Bearer jwt-123')
  })

  it('sends no Authorization header when getToken resolves null', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({
      baseUrl: BASE_URL,
      getToken: () => Promise.resolve(null),
      fetch,
    })

    await http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema })

    expect(recordedHeaders(calls[0])).not.toHaveProperty('Authorization')
  })

  it('throws an ApiError carrying status, code and message on an API error', async () => {
    const body = {
      message: 'Invalid or expired refresh token',
      code: ErrorCode.INVALID_REFRESH_TOKEN,
      metadata: {},
    }
    const { fetch } = mockFetchResponse(jsonResponse(body, HttpStatus.UNAUTHORIZED))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.status).toBe(HttpStatus.UNAUTHORIZED)
    expect(error.code).toBe(ErrorCode.INVALID_REFRESH_TOKEN)
    expect(error.message).toBe(body.message)
    expect(error.issues).toEqual([])
  })

  it('exposes metadata.issues on a 422 validation error', async () => {
    const issues = [{ path: 'email', message: 'Invalid email address', code: 'invalid_format' }]
    const body = {
      message: 'Validation failed',
      code: ErrorCode.UNPROCESSABLE_ENTITY,
      metadata: { issues },
    }
    const { fetch } = mockFetchResponse(jsonResponse(body, HttpStatus.UNPROCESSABLE_ENTITY))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({
        method: HttpMethod.POST,
        path: '/v1/ping',
        body: {},
        responseSchema: pingSchema,
      }),
    )

    expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
    expect(error.issues).toEqual(issues)
    expect(error.metadata).toEqual({ issues })
  })

  it('throws INVALID_RESPONSE when a success body does not match the schema', async () => {
    const { fetch } = mockFetchResponse(jsonResponse({ pong: 'yes' }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.INVALID_RESPONSE)
    expect(error.status).toBe(HttpStatus.OK)
    expect(error.cause).toBeInstanceOf(z.ZodError)
  })

  it('throws INVALID_RESPONSE when a success body is not JSON', async () => {
    const { fetch } = mockFetchResponse(new Response('<html>oops</html>', { status: 200 }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.INVALID_RESPONSE)
  })

  it('throws INVALID_RESPONSE with the HTTP status when an error body is not an API envelope', async () => {
    const { fetch } = mockFetchResponse(new Response('Bad Gateway', { status: 502 }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.INVALID_RESPONSE)
    expect(error.status).toBe(502)
  })

  it('throws INVALID_RESPONSE when an error JSON body lacks the envelope fields', async () => {
    const { fetch } = mockFetchResponse(
      jsonResponse({ error: 'nope' }, HttpStatus.INTERNAL_SERVER_ERROR),
    )
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.INVALID_RESPONSE)
    expect(error.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR)
  })
  it('replaces and URL-encodes path params', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/lists/:listId/items/:itemId',
      pathParams: { listId: 'a b/c', itemId: 42 },
      responseSchema: pingSchema,
    })

    expect(calls[0]?.url).toBe(`${BASE_URL}/v1/lists/a%20b%2Fc/items/42`)
  })

  it('throws before fetching when a path param is missing', async () => {
    const { fetch } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await expect(
      http.request({ method: HttpMethod.GET, path: '/v1/lists/:id', responseSchema: pingSchema }),
    ).rejects.toThrow('Missing path param "id" for /v1/lists/:id')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('serializes the query: skips nullish values, repeats array keys, keeps bracket keys', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/admin/users',
      query: {
        page: 2,
        isBanned: false,
        'email[ilike]': 'jane',
        tag: ['a', 'b'],
        sort: undefined,
        role: null,
      },
      responseSchema: pingSchema,
    })

    const url = new URL(calls[0]?.url ?? '')
    expect(url.pathname).toBe('/v1/admin/users')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('isBanned')).toBe('false')
    expect(url.searchParams.get('email[ilike]')).toBe('jane')
    expect(url.searchParams.getAll('tag')).toEqual(['a', 'b'])
    expect(url.searchParams.has('sort')).toBe(false)
    expect(url.searchParams.has('role')).toBe(false)
  })

  it('appends no "?" when every query value is nullish', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/ping',
      query: { sort: undefined },
      responseSchema: pingSchema,
    })

    expect(calls[0]?.url).toBe(`${BASE_URL}/v1/ping`)
  })

  it('resolves a 204 No Content response to undefined', async () => {
    const { fetch } = mockFetchResponse(new Response(null, { status: HttpStatus.NO_CONTENT }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await expect(
      http.request({
        method: HttpMethod.DELETE,
        path: '/v1/reservations/:id',
        pathParams: { id: 'r1' },
        responseSchema: noContentResponseSchema,
      }),
    ).resolves.toBeUndefined()
  })

  it('skips getToken on a public request', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => 'jwt-123', fetch })

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/ping',
      auth: RequestAuthMode.NONE,
      responseSchema: pingSchema,
    })

    expect(recordedHeaders(calls[0])).not.toHaveProperty('Authorization')
  })

  it('uses an explicit per-request token instead of getToken', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => 'jwt-123', fetch })

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/ping',
      auth: { token: 'rsv_abc' },
      responseSchema: pingSchema,
    })

    expect(recordedHeaders(calls[0]).Authorization).toBe('Bearer rsv_abc')
  })

  it('forwards the caller signal as-is when the timeout is disabled', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({
      baseUrl: BASE_URL,
      getToken: () => null,
      fetch,
      timeoutMs: null,
    })
    const controller = new AbortController()

    await http.request({
      method: HttpMethod.GET,
      path: '/v1/ping',
      signal: controller.signal,
      responseSchema: pingSchema,
    })

    expect(calls[0]?.init.signal).toBe(controller.signal)
  })

  it('attaches a timeout signal by default', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

    await http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema })

    expect(calls[0]?.init.signal).toBeInstanceOf(AbortSignal)
  })

  it('throws TIMEOUT with status 0 when the API does not answer in time', async () => {
    const http = createHttpClient({
      baseUrl: BASE_URL,
      getToken: () => null,
      fetch: hangingFetch,
      timeoutMs: 10,
    })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.TIMEOUT)
    expect(error.status).toBe(0)
  })

  it('throws ABORTED when the caller aborts the request', async () => {
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch: hangingFetch })
    const controller = new AbortController()

    const pending = captureError(
      http.request({
        method: HttpMethod.GET,
        path: '/v1/ping',
        signal: controller.signal,
        responseSchema: pingSchema,
      }),
    )
    controller.abort()
    const error = await pending

    expect(error.code).toBe(ClientErrorCode.ABORTED)
    expect(error.status).toBe(0)
  })

  it('throws NETWORK_ERROR with the fetch error as cause when the API is unreachable', async () => {
    const networkFailure = new TypeError('fetch failed')
    const http = createHttpClient({
      baseUrl: BASE_URL,
      getToken: () => null,
      fetch: () => Promise.reject(networkFailure),
    })

    const error = await captureError(
      http.request({ method: HttpMethod.GET, path: '/v1/ping', responseSchema: pingSchema }),
    )

    expect(error.code).toBe(ClientErrorCode.NETWORK_ERROR)
    expect(error.status).toBe(0)
    expect(error.cause).toBe(networkFailure)
  })
  it('types ApiError.code with the known codes while accepting unknown ones', () => {
    expectTypeOf<typeof ErrorCode.INVALID_REFRESH_TOKEN>().toExtend<ApiErrorCode>()
    expectTypeOf<typeof ClientErrorCode.INVALID_RESPONSE>().toExtend<ApiErrorCode>()
    expectTypeOf<string>().toExtend<ApiErrorCode>()
    expectTypeOf<ApiError['code']>().toEqualTypeOf<ApiErrorCode>()
  })

  it('sends FormData as-is and lets the runtime set the multipart Content-Type', async () => {
    const { fetch, calls } = mockFetchResponse(jsonResponse({ pong: true }))
    const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })
    const form = new FormData()
    form.set('name', 'x')

    await http.request({
      method: HttpMethod.POST,
      path: '/v1/ping',
      body: form,
      responseSchema: pingSchema,
    })

    expect(calls[0]?.init.body).toBe(form)
    expect(recordedHeaders(calls[0])).not.toHaveProperty('Content-Type')
  })

  describe('requestBlob', () => {
    it('returns the raw body and accepts any content type', async () => {
      const { fetch, calls } = mockFetchResponse(new Response('raw-bytes'))
      const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

      const blob = await http.requestBlob({ method: HttpMethod.GET, path: '/v1/file' })

      expect(await blob.text()).toBe('raw-bytes')
      expect(recordedHeaders(calls[0]).Accept).toBe('*/*')
    })

    it('maps a transport failure while reading the body', async () => {
      const failingBody = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.error(new TypeError('connection lost'))
        },
      })
      const { fetch } = mockFetchResponse(new Response(failingBody))
      const http = createHttpClient({ baseUrl: BASE_URL, getToken: () => null, fetch })

      const error = await captureError(
        http.requestBlob({ method: HttpMethod.GET, path: '/v1/file' }),
      )

      expect(error.code).toBe(ClientErrorCode.NETWORK_ERROR)
    })
  })

  describe('onUnauthorized', () => {
    const UNAUTHORIZED_BODY = {
      message: 'Unauthorized',
      code: ErrorCode.UNAUTHORIZED,
      metadata: {},
    }
    const FRESH_TOKEN = 'fresh'
    const pingRequest = {
      method: HttpMethod.GET,
      path: '/v1/ping',
      responseSchema: pingSchema,
    }

    // Accepts only the fresh token, like the API once the old access token has expired.
    function tokenAwareFetch(): ReturnType<typeof mockFetchHandler> {
      return mockFetchHandler((call) =>
        recordedHeaders(call).Authorization === `Bearer ${FRESH_TOKEN}`
          ? jsonResponse({ pong: true })
          : jsonResponse(UNAUTHORIZED_BODY, HttpStatus.UNAUTHORIZED),
      )
    }

    it('refreshes once for concurrent 401s and retries each request once', async () => {
      let token = 'expired'
      let refreshCalls = 0
      const { fetch, calls } = tokenAwareFetch()
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => token,
        fetch,
        onUnauthorized: async () => {
          refreshCalls += 1
          await Promise.resolve()
          token = FRESH_TOKEN
          return true
        },
      })

      const results = await Promise.all([
        http.request(pingRequest),
        http.request(pingRequest),
        http.request(pingRequest),
      ])

      expect(results).toEqual([{ pong: true }, { pong: true }, { pong: true }])
      expect(refreshCalls).toBe(1)
      expect(calls).toHaveLength(6)
      expect(recordedHeaders(calls[5]).Authorization).toBe(`Bearer ${FRESH_TOKEN}`)
    })

    it('does not refresh again for a 401 that lands after the refresh finished', async () => {
      let token = FRESH_TOKEN
      let refreshCalls = 0
      const { fetch, calls } = mockFetchHandler((call) =>
        recordedHeaders(call).Authorization === 'Bearer stale'
          ? jsonResponse(UNAUTHORIZED_BODY, HttpStatus.UNAUTHORIZED)
          : jsonResponse({ pong: true }),
      )
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => {
          const current = token
          token = FRESH_TOKEN
          return current
        },
        fetch,
        onUnauthorized: () => {
          refreshCalls += 1
          return true
        },
      })
      token = 'stale'

      await expect(http.request(pingRequest)).resolves.toEqual({ pong: true })

      expect(refreshCalls).toBe(0)
      expect(calls).toHaveLength(2)
    })

    it('surfaces the 401 of the retry instead of looping', async () => {
      let refreshCalls = 0
      const { fetch, calls } = mockFetchHandler(() =>
        jsonResponse(UNAUTHORIZED_BODY, HttpStatus.UNAUTHORIZED),
      )
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'token',
        fetch,
        onUnauthorized: () => {
          refreshCalls += 1
          return true
        },
      })

      const error = await captureError(http.request(pingRequest))

      expect(error.status).toBe(HttpStatus.UNAUTHORIZED)
      expect(refreshCalls).toBe(1)
      expect(calls).toHaveLength(2)
    })

    it('surfaces the original 401 when the handler gives up', async () => {
      const { fetch, calls } = tokenAwareFetch()
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'expired',
        fetch,
        onUnauthorized: () => false,
      })

      const error = await captureError(http.request(pingRequest))

      expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(calls).toHaveLength(1)
    })

    it('surfaces the 401 with the handler error as cause when the handler rejects', async () => {
      const refreshFailure = new Error('refresh failed')
      const { fetch, calls } = tokenAwareFetch()
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'expired',
        fetch,
        onUnauthorized: () => Promise.reject(refreshFailure),
      })

      const error = await captureError(http.request(pingRequest))

      expect(error.status).toBe(HttpStatus.UNAUTHORIZED)
      expect(error.code).toBe(ErrorCode.UNAUTHORIZED)
      expect(error.cause).toBe(refreshFailure)
      expect(calls).toHaveLength(1)
    })

    it('allows a new refresh once the previous one has settled', async () => {
      let refreshCalls = 0
      const { fetch } = mockFetchHandler(() =>
        jsonResponse(UNAUTHORIZED_BODY, HttpStatus.UNAUTHORIZED),
      )
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'token',
        fetch,
        onUnauthorized: () => {
          refreshCalls += 1
          return false
        },
      })

      await captureError(http.request(pingRequest))
      await captureError(http.request(pingRequest))

      expect(refreshCalls).toBe(2)
    })

    it.each([
      ['a public route', RequestAuthMode.NONE],
      ['an explicit token', { token: 'rsv_abc' }],
    ])('never runs for %s', async (_label, auth) => {
      let refreshCalls = 0
      const { fetch, calls } = tokenAwareFetch()
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'expired',
        fetch,
        onUnauthorized: () => {
          refreshCalls += 1
          return true
        },
      })

      const error = await captureError(http.request({ ...pingRequest, auth }))

      expect(error.status).toBe(HttpStatus.UNAUTHORIZED)
      expect(refreshCalls).toBe(0)
      expect(calls).toHaveLength(1)
    })

    it('never runs on a non-401 error', async () => {
      let refreshCalls = 0
      const { fetch } = mockFetchHandler(() =>
        jsonResponse(
          { message: 'Forbidden', code: ErrorCode.FORBIDDEN, metadata: {} },
          HttpStatus.FORBIDDEN,
        ),
      )
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => 'token',
        fetch,
        onUnauthorized: () => {
          refreshCalls += 1
          return true
        },
      })

      await captureError(http.request(pingRequest))

      expect(refreshCalls).toBe(0)
    })

    it('also covers blob downloads', async () => {
      let token = 'expired'
      const { fetch, calls } = tokenAwareFetch()
      const http = createHttpClient({
        baseUrl: BASE_URL,
        getToken: () => token,
        fetch,
        onUnauthorized: () => {
          token = FRESH_TOKEN
          return true
        },
      })

      const blob = await http.requestBlob({ method: HttpMethod.GET, path: '/v1/file' })

      expect(JSON.parse(await blob.text())).toEqual({ pong: true })
      expect(calls).toHaveLength(2)
    })
  })
})
