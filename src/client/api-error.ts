import { validationErrorMetadataSchema } from '../schemas/shared/error.js'
import type { ValidationIssueParsed } from '../schemas/shared/error.js'

export const ClientErrorCode = {
  INVALID_RESPONSE: 'INVALID_RESPONSE',
} as const
export type ClientErrorCode = (typeof ClientErrorCode)[keyof typeof ClientErrorCode]

export const INVALID_RESPONSE_MESSAGE = 'The API response does not match the expected contract'

export interface ApiErrorOptions {
  status: number
  code: string
  message: string
  metadata: Record<string, unknown>
  cause?: unknown
}

export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly status: number
  readonly code: string
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

function extractValidationIssues(metadata: Record<string, unknown>): ValidationIssueParsed[] {
  const parsed = validationErrorMetadataSchema.safeParse(metadata)
  return parsed.success ? parsed.data.issues : []
}
