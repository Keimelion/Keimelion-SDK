import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ApiError, ClientErrorCode } from '../../src/client/api-error.js'
import { createHttpClient } from '../../src/client/http-client.js'
import { ErrorCode } from '../../src/enums/error-code.js'
import { HttpMethod, HttpStatus } from '../../src/enums/http.js'
import { jsonResponse, mockFetchResponse, recordedHeaders } from './fetch-mock.js'

const BASE_URL = 'https://api.example.com'
const pingSchema = z.object({ pong: z.boolean() })

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
})
