import { describe, expect, it } from 'vitest'
import { ApiError, ClientErrorCode } from '../../src/client/_core/api-error.js'
import { createClient } from '../../src/client/create-client.js'
import type { KeimelionClient } from '../../src/client/create-client.js'
import { ErrorCode } from '../../src/enums/error-code.js'
import { HttpStatus } from '../../src/enums/http.js'
import { buildUserDetailWire, ID, SOURCE_ID } from '../fixtures.js'
import { ADMIN_CASES } from './cases/admin.cases.js'
import type { EndpointCase } from './cases/endpoint-case.js'
import { USER_FACING_CASES } from './cases/user-facing.cases.js'
import { jsonResponse, mockFetchResponse, recordedHeaders } from './fetch-mock.js'
import type { RecordedRequest } from './fetch-mock.js'

const BASE_URL = 'https://api.example.com'
const TOKEN = 'jwt-token'
const USER_FACING_ENDPOINT_COUNT = 32
const ADMIN_ENDPOINT_COUNT = 47
const EXPORT_ENDPOINT = 'GET /v1/users/me/export'
const NOT_FOUND_BODY = { message: 'Resource not found', code: ErrorCode.NOT_FOUND, metadata: {} }

function splitId(testCase: EndpointCase): { method: string; path: string } {
  const [method, template] = testCase.id.split(' ') as [string, string]
  const path = template.replace(/:(\w+)/g, (_match, name: string) => {
    if (name === 'sourceId') return SOURCE_ID
    return testCase.pathOverrides?.[name] ?? ID
  })
  return { method, path }
}

function buildClient(response: Response): {
  client: KeimelionClient
  calls: RecordedRequest[]
} {
  const { fetch, calls } = mockFetchResponse(response)
  return { client: createClient({ baseUrl: BASE_URL, getToken: () => TOKEN, fetch }), calls }
}

function wireResponse(testCase: EndpointCase): Response {
  if (testCase.wire === undefined) return new Response(null, { status: HttpStatus.NO_CONTENT })
  return jsonResponse(testCase.wire, testCase.status ?? HttpStatus.OK)
}

function assertAuthorization(call: RecordedRequest | undefined, auth: string | undefined): void {
  const headers = recordedHeaders(call)
  if (auth === 'none') {
    expect(headers).not.toHaveProperty('Authorization')
    return
  }
  expect(headers.Authorization).toBe(`Bearer ${auth ?? TOKEN}`)
}

function assertQuery(url: URL, query: EndpointCase['query']): void {
  for (const [key, expected] of Object.entries(query ?? {})) {
    expect(url.searchParams.getAll(key)).toEqual([expected].flat())
  }
}

describe.each(
  [...USER_FACING_CASES, ...ADMIN_CASES].map((testCase) => [testCase.id, testCase] as const),
)('client endpoint %s', (_id, testCase) => {
  it('sends the declared request and returns the parsed response', async () => {
    const { client, calls } = buildClient(wireResponse(testCase))
    const { method, path } = splitId(testCase)

    const result = await testCase.call(client)

    const url = new URL(calls[0]?.url ?? '')
    expect(calls).toHaveLength(1)
    expect(calls[0]?.init.method).toBe(method)
    expect(url.pathname).toBe(path)
    assertQuery(url, testCase.query)
    assertAuthorization(calls[0], testCase.auth)
    if (testCase.body !== undefined) {
      expect(JSON.parse(calls[0]?.init.body as string)).toEqual(testCase.body)
    }
    expect(result).toEqual(testCase.schema.parse(testCase.wire))
  })

  it('maps an API error to an ApiError', async () => {
    const { client } = buildClient(jsonResponse(NOT_FOUND_BODY, HttpStatus.NOT_FOUND))

    const error: unknown = await testCase.call(client).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).status).toBe(HttpStatus.NOT_FOUND)
    expect((error as ApiError).code).toBe(ErrorCode.NOT_FOUND)
    expect((error as ApiError).message).toBe(NOT_FOUND_BODY.message)
  })

  it('throws INVALID_RESPONSE on a malformed body', async () => {
    const { client } = buildClient(jsonResponse({ unexpected: true }))

    const error: unknown = await testCase.call(client).catch((caught: unknown) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect((error as ApiError).code).toBe(ClientErrorCode.INVALID_RESPONSE)
  })

  it('strips unknown keys from an object response', () => {
    if (typeof testCase.wire !== 'object' || Array.isArray(testCase.wire)) return

    const parsed = testCase.schema.parse({ ...testCase.wire, additiveField: true }) as object

    expect(parsed).not.toHaveProperty('additiveField')
  })
})

describe('endpoint inventory', () => {
  it('covers the 32 user-facing and 47 admin endpoints exactly once', () => {
    const userFacing = new Set([
      ...USER_FACING_CASES.map((testCase) => testCase.id),
      EXPORT_ENDPOINT,
    ])
    const admin = new Set(ADMIN_CASES.map((testCase) => testCase.id))

    expect(userFacing.size).toBe(USER_FACING_ENDPOINT_COUNT)
    expect(admin.size).toBe(ADMIN_ENDPOINT_COUNT)
    expect(USER_FACING_CASES).toHaveLength(USER_FACING_ENDPOINT_COUNT - 1)
    expect(ADMIN_CASES).toHaveLength(ADMIN_ENDPOINT_COUNT)
  })
})

describe('client.users.exportData', () => {
  it('returns the ZIP as a Blob without parsing it', async () => {
    const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04])
    const { client, calls } = buildClient(
      new Response(zip, { headers: { 'Content-Type': 'application/zip' } }),
    )

    const blob = await client.users.exportData({ format: 'csv' })

    expect(new URL(calls[0]?.url ?? '').searchParams.get('format')).toBe('csv')
    expect(recordedHeaders(calls[0]).Authorization).toBe(`Bearer ${TOKEN}`)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/zip')
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(zip)
  })

  it('does not apply any schema to a JSON export', async () => {
    const { client } = buildClient(jsonResponse({ unexpected: true }))

    const blob = await client.users.exportData()

    expect(JSON.parse(await blob.text())).toEqual({ unexpected: true })
  })

  it('maps an API error to an ApiError', async () => {
    const { client } = buildClient(jsonResponse(NOT_FOUND_BODY, HttpStatus.NOT_FOUND))

    await expect(client.users.exportData()).rejects.toMatchObject({
      status: HttpStatus.NOT_FOUND,
      code: ErrorCode.NOT_FOUND,
    })
  })

  it('throws INVALID_RESPONSE when an error body is not an API envelope', async () => {
    const { client } = buildClient(new Response('Bad Gateway', { status: 502 }))

    await expect(client.users.exportData()).rejects.toMatchObject({
      status: 502,
      code: ClientErrorCode.INVALID_RESPONSE,
    })
  })
})

describe('multipart endpoints', () => {
  const itemWire =
    USER_FACING_CASES.find((testCase) => testCase.id === 'POST /v1/items')?.wire ?? {}
  const profileWire =
    USER_FACING_CASES.find((testCase) => testCase.id === 'GET /v1/users/me')?.wire ?? {}

  it.each<[string, object, (client: KeimelionClient, form: FormData) => Promise<unknown>]>([
    [
      'POST /v1/auth/register',
      { user: buildUserDetailWire(), refreshToken: 'refresh' },
      (client, form) => client.auth.register(form),
    ],
    ['POST /v1/items', itemWire, (client, form) => client.items.create(form)],
    ['PATCH /v1/items/:id', itemWire, (client, form) => client.items.update(ID, form)],
    ['PATCH /v1/users/me', profileWire, (client, form) => client.users.updateProfile(form)],
    ['POST /v1/admin/items', itemWire, (client, form) => client.admin.items.create(form)],
    ['PATCH /v1/admin/items/:id', itemWire, (client, form) => client.admin.items.update(ID, form)],
  ])('%s sends FormData untouched', async (_id, wire, call) => {
    const { client, calls } = buildClient(jsonResponse(wire))
    const form = new FormData()
    form.set('name', 'Headphones')
    form.set('image', new Blob(['image-bytes'], { type: 'image/png' }), 'image.png')

    await call(client, form)

    expect(calls[0]?.init.body).toBe(form)
    expect(recordedHeaders(calls[0])).not.toHaveProperty('Content-Type')
  })
})

describe('client.reservations anonymous access', () => {
  const reservationCase = USER_FACING_CASES.find(
    (testCase) => testCase.id === 'GET /v1/reservations/:id',
  )

  it('falls back to getToken without a reservation token', async () => {
    const { client, calls } = buildClient(jsonResponse(reservationCase?.wire))

    await client.reservations.get(ID)

    expect(recordedHeaders(calls[0]).Authorization).toBe(`Bearer ${TOKEN}`)
  })

  it('sends the reservation token on delete', async () => {
    const { client, calls } = buildClient(new Response(null, { status: HttpStatus.NO_CONTENT }))

    await client.reservations.delete(ID, { reservationToken: 'rsv_abc' })

    expect(recordedHeaders(calls[0]).Authorization).toBe('Bearer rsv_abc')
  })
})
