import type { z } from 'zod'
import { HttpHeader, HttpStatus } from '../../enums/http.js'
import type { HttpMethod } from '../../enums/http.js'
import { apiErrorBodySchema } from '../../schemas/_shared/error.js'
import { ApiError, createInvalidResponseError, createTransportError } from './api-error.js'

const JSON_CONTENT_TYPE = 'application/json'
const ANY_CONTENT_TYPE = '*/*'
const PATH_PARAM_PREFIX = ':'
export const DEFAULT_TIMEOUT_MS = 30_000

export type TokenProvider = () => string | null | Promise<string | null>

// Called when a request authenticated through `getToken` receives a 401. Resolve `true` once the
// session is renewed (the request is replayed with the new `getToken` value), `false` to give up.
export type UnauthorizedHandler = () => boolean | Promise<boolean>

export type FetchFunction = (url: string, init: RequestInit) => Promise<Response>

export type PathParams = Record<string, string | number>

export type QueryValue = string | number | boolean | null | undefined

// `null` / `undefined` values are skipped; arrays are sent as repeated keys (`?tag=a&tag=b`).
// Bracket keys pass through as-is, e.g. `{ 'title[ilike]': 'foo' }` for admin filters.
export type QueryParams = Record<string, QueryValue | readonly QueryValue[]>

export const RequestAuthMode = {
  // Default: the Bearer token comes from the client's `getToken`.
  TOKEN_PROVIDER: 'token-provider',
  // Public route: never send an Authorization header.
  NONE: 'none',
} as const
export type RequestAuthMode = (typeof RequestAuthMode)[keyof typeof RequestAuthMode]

// An explicit token bypasses `getToken` (e.g. the anonymous `rsv_…` reservation token).
export type RequestAuth = RequestAuthMode | { token: string }

export interface HttpBlobRequest {
  method: HttpMethod
  // Path template; `:name` segments are replaced from `pathParams`, e.g. `/v1/lists/:id`.
  path: string
  pathParams?: PathParams
  query?: QueryParams
  // Serialized as JSON, except FormData which is sent as-is (multipart/form-data).
  body?: unknown
  auth?: RequestAuth
  // Combined with the client timeout: whichever fires first aborts the request.
  signal?: AbortSignal
}

export interface HttpRequest<TResponseSchema extends z.ZodType> extends HttpBlobRequest {
  responseSchema: TResponseSchema
}

export interface HttpClient {
  request<TResponseSchema extends z.ZodType>(
    request: HttpRequest<TResponseSchema>,
  ): Promise<z.output<TResponseSchema>>
  // For binary downloads: the body is returned as-is, without Zod parsing.
  requestBlob(request: HttpBlobRequest): Promise<Blob>
}

export interface HttpClientOptions {
  baseUrl: string
  getToken: TokenProvider
  fetch?: FetchFunction
  // Per-request timeout; `null` disables it. Defaults to DEFAULT_TIMEOUT_MS.
  timeoutMs?: number | null
  // Concurrent 401s share a single call; each failed request is then replayed once.
  onUnauthorized?: UnauthorizedHandler
}

interface SentRequest {
  response: Response
  token: string | null
}

type SessionRecovery = { recovered: boolean } | { recovered: false; cause: unknown }

type JsonBodyResult = { isJson: true; value: unknown } | { isJson: false; cause: unknown }

export function createHttpClient(options: HttpClientOptions): HttpClient {
  const baseUrl = trimTrailingSlashes(options.baseUrl)
  const fetchFunction = options.fetch ?? defaultFetch
  const timeoutMs = options.timeoutMs === undefined ? DEFAULT_TIMEOUT_MS : options.timeoutMs

  const recoverSession = options.onUnauthorized
    ? createSessionRecovery(options.getToken, options.onUnauthorized)
    : null

  async function send(request: HttpBlobRequest, accept: string): Promise<SentRequest> {
    const url = `${baseUrl}${buildPath(request.path, request.pathParams)}${buildQueryString(request.query)}`
    const token = await resolveToken(request.auth, options.getToken)
    const init = buildRequestInit(request, { accept, token, timeoutMs })
    const response = await fetchFunction(url, init).catch((error: unknown) => {
      throw createTransportError(error)
    })
    return { response, token }
  }

  async function sendWithSessionRecovery(
    request: HttpBlobRequest,
    accept: string,
  ): Promise<Response> {
    const first = await send(request, accept)
    if (!recoverSession || !isSessionFailure(first.response, request.auth)) {
      return first.response
    }
    const recovery = await recoverSession(first.token)
    if ('cause' in recovery) {
      throw toApiError(first.response.status, await readJsonBody(first.response), recovery.cause)
    }
    if (!recovery.recovered) return first.response
    await first.response.body?.cancel()
    const retry = await send(request, accept)
    return retry.response
  }

  return {
    async request<TResponseSchema extends z.ZodType>(
      request: HttpRequest<TResponseSchema>,
    ): Promise<z.output<TResponseSchema>> {
      const response = await sendWithSessionRecovery(request, JSON_CONTENT_TYPE)
      const body = await readJsonBody(response)
      if (!response.ok) {
        throw toApiError(response.status, body)
      }
      return parseResponseBody(response.status, body, request.responseSchema)
    },
    async requestBlob(request: HttpBlobRequest): Promise<Blob> {
      const response = await sendWithSessionRecovery(request, ANY_CONTENT_TYPE)
      if (!response.ok) {
        throw toApiError(response.status, await readJsonBody(response))
      }
      return response.blob().catch((error: unknown) => {
        throw createTransportError(error)
      })
    },
  }
}

function createSessionRecovery(
  getToken: TokenProvider,
  onUnauthorized: UnauthorizedHandler,
): (sentToken: string | null) => Promise<SessionRecovery> {
  let inFlight: Promise<SessionRecovery> | null = null

  async function runHandler(): Promise<SessionRecovery> {
    try {
      return { recovered: await onUnauthorized() }
    } catch (cause: unknown) {
      return { recovered: false, cause }
    }
  }

  return async (sentToken) => {
    if (inFlight) return inFlight
    const currentToken = await getToken()
    // A 401 landing after the refresh finished carries the old token: just replay it.
    if (currentToken !== null && currentToken !== sentToken) return { recovered: true }
    inFlight ??= runHandler().finally(() => {
      inFlight = null
    })
    return inFlight
  }
}

function isSessionFailure(response: Response, auth: RequestAuth | undefined): boolean {
  const usesTokenProvider = auth === undefined || auth === RequestAuthMode.TOKEN_PROVIDER
  return usesTokenProvider && response.status === HttpStatus.UNAUTHORIZED
}

function trimTrailingSlashes(url: string): string {
  let end = url.length
  while (end > 0 && url[end - 1] === '/') {
    end -= 1
  }
  return url.slice(0, end)
}

function defaultFetch(url: string, init: RequestInit): Promise<Response> {
  return globalThis.fetch(url, init)
}

function buildPath(template: string, pathParams: PathParams = {}): string {
  return template
    .split('/')
    .map((segment) => {
      if (!segment.startsWith(PATH_PARAM_PREFIX)) return segment
      const name = segment.slice(PATH_PARAM_PREFIX.length)
      const value = pathParams[name]
      if (value === undefined) {
        throw new Error(`Missing path param "${name}" for ${template}`)
      }
      return encodeURIComponent(String(value))
    })
    .join('/')
}

function buildQueryString(query: QueryParams | undefined): string {
  if (!query) return ''
  const searchParams = new URLSearchParams()
  for (const [key, rawValue] of Object.entries(query)) {
    const values: readonly QueryValue[] = Array.isArray(rawValue) ? rawValue : [rawValue]
    for (const value of values) {
      if (value === null || value === undefined) continue
      searchParams.append(key, String(value))
    }
  }
  const serialized = searchParams.toString()
  return serialized === '' ? '' : `?${serialized}`
}

async function resolveToken(
  auth: RequestAuth | undefined,
  getToken: TokenProvider,
): Promise<string | null> {
  if (auth === RequestAuthMode.NONE) return null
  if (typeof auth === 'object') return auth.token
  return getToken()
}

function buildSignal(
  callerSignal: AbortSignal | undefined,
  timeoutMs: number | null,
): AbortSignal | undefined {
  if (timeoutMs === null) return callerSignal
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  return callerSignal ? AbortSignal.any([callerSignal, timeoutSignal]) : timeoutSignal
}

interface RequestInitOptions {
  accept: string
  token: string | null
  timeoutMs: number | null
}

function buildRequestInit(request: HttpBlobRequest, options: RequestInitOptions): RequestInit {
  const headers: Record<string, string> = { [HttpHeader.ACCEPT]: options.accept }
  if (options.token) {
    headers[HttpHeader.AUTHORIZATION] = `Bearer ${options.token}`
  }
  const init: RequestInit = { method: request.method, headers }
  const signal = buildSignal(request.signal, options.timeoutMs)
  if (signal) {
    init.signal = signal
  }
  if (request.body === undefined) {
    return init
  }
  // The runtime must set the multipart Content-Type itself: it carries the boundary.
  if (request.body instanceof FormData) {
    return { ...init, body: request.body }
  }
  headers[HttpHeader.CONTENT_TYPE] = JSON_CONTENT_TYPE
  return { ...init, body: JSON.stringify(request.body) }
}

async function readJsonBody(response: Response): Promise<JsonBodyResult> {
  if (response.status === HttpStatus.NO_CONTENT) {
    return { isJson: true, value: undefined }
  }
  try {
    return { isJson: true, value: await response.json() }
  } catch (error: unknown) {
    return { isJson: false, cause: error }
  }
}

function toApiError(status: number, body: JsonBodyResult, cause?: unknown): ApiError {
  if (!body.isJson) {
    return createInvalidResponseError(status, body.cause)
  }
  const envelope = apiErrorBodySchema.safeParse(body.value)
  if (!envelope.success) {
    return createInvalidResponseError(status, envelope.error)
  }
  return new ApiError({ status, ...envelope.data, cause })
}

function parseResponseBody<TResponseSchema extends z.ZodType>(
  status: number,
  body: JsonBodyResult,
  responseSchema: TResponseSchema,
): z.output<TResponseSchema> {
  if (!body.isJson) {
    throw createInvalidResponseError(status, body.cause)
  }
  const parsed = responseSchema.safeParse(body.value)
  if (!parsed.success) {
    throw createInvalidResponseError(status, parsed.error)
  }
  return parsed.data
}
