import { validationErrorMetadataSchema } from '../../schemas/_shared/error.js'
import type { ValidationIssueParsed } from '../../schemas/_shared/error.js'
import type { ErrorCode } from '../../enums/error-code.js'

// Errors raised by the client itself (status 0 when no HTTP response was received).
export const ClientErrorCode = {
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  ABORTED: 'ABORTED',
} as const
export type ClientErrorCode = (typeof ClientErrorCode)[keyof typeof ClientErrorCode]

// Known codes autocomplete; the `string` fallback keeps an older client working when the API
// starts sending a code this SDK version does not know yet.
export type ApiErrorCode = ErrorCode | ClientErrorCode | (string & Record<never, never>)

export const INVALID_RESPONSE_MESSAGE = 'The API response does not match the expected contract'
export const NETWORK_ERROR_MESSAGE = 'The API could not be reached'
export const TIMEOUT_MESSAGE = 'The API did not respond in time'
export const ABORTED_MESSAGE = 'The request was aborted'

const NO_RESPONSE_STATUS = 0
const TIMEOUT_ERROR_NAME = 'TimeoutError'
const ABORT_ERROR_NAME = 'AbortError'

export interface ApiErrorOptions {
  status: number
  code: ApiErrorCode
  message: string
  metadata: Record<string, unknown>
  cause?: unknown
}

export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly status: number
  readonly code: ApiErrorCode
  readonly metadata: Record<string, unknown>
  readonly issues: ValidationIssueParsed[]

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause })
    this.status = options.status
    this.code = options.code
    this.metadata = options.metadata
    this.issues = extractValidationIssues(options.metadata)
  }
}

export function createInvalidResponseError(status: number, cause: unknown): ApiError {
  return new ApiError({
    status,
    code: ClientErrorCode.INVALID_RESPONSE,
    message: INVALID_RESPONSE_MESSAGE,
    metadata: {},
    cause,
  })
}

// fetch rejects without an HTTP response: offline, DNS, CORS, timeout or caller abort.
export function createTransportError(cause: unknown): ApiError {
  const errorName = cause instanceof Error ? cause.name : null
  if (errorName === TIMEOUT_ERROR_NAME) {
    return createClientError(ClientErrorCode.TIMEOUT, TIMEOUT_MESSAGE, cause)
  }
  if (errorName === ABORT_ERROR_NAME) {
    return createClientError(ClientErrorCode.ABORTED, ABORTED_MESSAGE, cause)
  }
  return createClientError(ClientErrorCode.NETWORK_ERROR, NETWORK_ERROR_MESSAGE, cause)
}

function createClientError(code: ClientErrorCode, message: string, cause: unknown): ApiError {
  return new ApiError({ status: NO_RESPONSE_STATUS, code, message, metadata: {}, cause })
}

function extractValidationIssues(metadata: Record<string, unknown>): ValidationIssueParsed[] {
  const parsed = validationErrorMetadataSchema.safeParse(metadata)
  return parsed.success ? parsed.data.issues : []
}
