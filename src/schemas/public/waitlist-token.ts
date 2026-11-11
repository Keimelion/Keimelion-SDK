import { z } from 'zod'

// 32 random bytes encoded as base64url without padding.
export const WAITLIST_TOKEN_LENGTH = 43

const WAITLIST_TOKEN_REGEX = /^[A-Za-z0-9_-]+$/
const WAITLIST_TOKEN_FORMAT_MESSAGE = 'Token must be a base64url-encoded value'

export const waitlistTokenSchema = z
  .string()
  .length(
    WAITLIST_TOKEN_LENGTH,
    `Token must be exactly ${String(WAITLIST_TOKEN_LENGTH)} characters`,
  )
  .regex(WAITLIST_TOKEN_REGEX, WAITLIST_TOKEN_FORMAT_MESSAGE)

export type WaitlistTokenInput = z.input<typeof waitlistTokenSchema>
export type WaitlistTokenParsed = z.output<typeof waitlistTokenSchema>
