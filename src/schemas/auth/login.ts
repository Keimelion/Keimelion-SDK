import { z } from 'zod'
import { userDetailSchema } from '../_shared/user-detail.js'
import { emailSchema } from '../_shared/email.js'

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export type LoginRequestInput = z.input<typeof loginRequestSchema>
export type LoginRequestParsed = z.output<typeof loginRequestSchema>

// An unverified account signs in until its user.emailVerificationDeadlineAt; from that instant it
// gets a 403 EMAIL_NOT_VERIFIED. A banned account gets ACCOUNT_BANNED, verified or not.
export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userDetailSchema,
})

export type LoginResponseInput = z.input<typeof loginResponseSchema>
export type LoginResponseParsed = z.output<typeof loginResponseSchema>
