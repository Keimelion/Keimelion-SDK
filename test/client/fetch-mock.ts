import { vi } from 'vitest'
import type { FetchFunction } from '../../src/client/_core/http-client.js'

export interface RecordedRequest {
  url: string
  init: RequestInit
}

export function mockFetchResponse(response: Response): {
  fetch: FetchFunction
  calls: RecordedRequest[]
} {
  const calls: RecordedRequest[] = []
  const fetch = vi.fn<FetchFunction>((url, init) => {
    calls.push({ url, init })
    return Promise.resolve(response)
  })
  return { fetch, calls }
}

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}

export function recordedHeaders(call: RecordedRequest | undefined): Record<string, string> {
  return (call?.init.headers ?? {}) as Record<string, string>
}
