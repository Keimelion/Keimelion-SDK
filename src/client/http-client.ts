import type { z } from 'zod'
import { HttpHeader } from '../enums/http.js'
import type { HttpMethod } from '../enums/http.js'
import { apiErrorBodySchema } from '../schemas/shared/error.js'
import { ApiError, createInvalidResponseError } from './api-error.js'

const JSON_CONTENT_TYPE = 'application/json'
const TRAILING_SLASHES_REGEX = /\/+$/

export type TokenProvider = () => string | null | Promise<string | null>

export type FetchFunction = (url: string, init: RequestInit) => Promise<Response>

export interface HttpRequest<TResponseSchema extends z.ZodType> {
  method: HttpMethod
  path: string
  body?: unknown
  responseSchema: TResponseSchema
}

export interface HttpClient {
  request<TResponseSchema extends z.ZodType>(
    request: HttpRequest<TResponseSchema>,
  ): Promise<z.output<TResponseSchema>>
}

export interface HttpClientOptions {
  baseUrl: string
  getToken: TokenProvider
  fetch?: FetchFunction
}

type JsonBodyResult = { isJson: true; value: unknown } | { isJson: false; cause: unknown }

export function createHttpClient(options: HttpClientOptions): HttpClient {
  const baseUrl = options.baseUrl.replace(TRAILING_SLASHES_REGEX, '')
  const fetchFunction = options.fetch ?? defaultFetch

  return {
    async request<TResponseSchema extends z.ZodType>(
      request: HttpRequest<TResponseSchema>,
    ): Promise<z.output<TResponseSchema>> {
      const init = await buildRequestInit(request, options.getToken)
      const response = await fetchFunction(`${baseUrl}${request.path}`, init)
      const body = await readJsonBody(response)
      if (!response.ok) {
        throw toApiError(response.status, body)
      }
      return parseResponseBody(response.status, body, request.responseSchema)
    },
  }
}

function defaultFetch(url: string, init: RequestInit): Promise<Response> {
  return globalThis.fetch(url, init)
}

async function buildRequestInit<TResponseSchema extends z.ZodType>(
  request: HttpRequest<TResponseSchema>,
  getToken: TokenProvider,
): Promise<RequestInit> {
  const headers: Record<string, string> = { [HttpHeader.ACCEPT]: JSON_CONTENT_TYPE }
  const token = await getToken()
  if (token) {
    headers[HttpHeader.AUTHORIZATION] = `Bearer ${token}`
  }
  if (request.body === undefined) {
    return { method: request.method, headers }
  }
  headers[HttpHeader.CONTENT_TYPE] = JSON_CONTENT_TYPE
  return { method: request.method, headers, body: JSON.stringify(request.body) }
}

async function readJsonBody(response: Response): Promise<JsonBodyResult> {
  try {
    return { isJson: true, value: await response.json() }
  } catch (error: unknown) {
    return { isJson: false, cause: error }
  }
}

function toApiError(status: number, body: JsonBodyResult): ApiError {
  if (!body.isJson) {
    return createInvalidResponseError(status, body.cause)
  }
  const envelope = apiErrorBodySchema.safeParse(body.value)
  if (!envelope.success) {
    return createInvalidResponseError(status, envelope.error)
  }
  return new ApiError({ status, ...envelope.data })
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
