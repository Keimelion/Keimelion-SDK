import { z } from 'zod'

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
})

export type RefreshRequestInput = z.input<typeof refreshRequestSchema>
export type RefreshRequestParsed = z.output<typeof refreshRequestSchema>

// An unverified account refreshes until its user.emailVerificationDeadlineAt; from that instant it
// gets a 403 EMAIL_NOT_VERIFIED: the refresh token is neither rotated nor revoked and works again
// once the email is verified. A banned account gets ACCOUNT_BANNED, verified or not.
export const refreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

export type RefreshResponseInput = z.input<typeof refreshResponseSchema>
export type RefreshResponseParsed = z.output<typeof refreshResponseSchema>
