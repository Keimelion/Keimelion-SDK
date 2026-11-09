import { z } from 'zod'
import { LOCALES } from '../../enums/locale.js'
import { WAITLIST_SIGNUP_STATUS_VALUES } from '../../enums/waitlist-signup-status.js'
import { emailSchema } from '../_shared/email.js'

export const MAX_WAITLIST_EMAIL_LENGTH = 254
export const MAX_WAITLIST_HONEYPOT_LENGTH = 200

export const waitlistCreateRequestSchema = z.strictObject({
  email: emailSchema.pipe(
    z
      .string()
      .max(
        MAX_WAITLIST_EMAIL_LENGTH,
        `Email must be at most ${String(MAX_WAITLIST_EMAIL_LENGTH)} characters`,
      ),
  ),
  locale: z.enum(LOCALES),
  consent: z.literal(true),
  honeypot: z.string().trim().max(MAX_WAITLIST_HONEYPOT_LENGTH).optional(),
})

export type WaitlistCreateRequestInput = z.input<typeof waitlistCreateRequestSchema>
export type WaitlistCreateRequestParsed = z.output<typeof waitlistCreateRequestSchema>

export const waitlistCreateResponseSchema = z.object({
  status: z.enum(WAITLIST_SIGNUP_STATUS_VALUES),
})

export type WaitlistCreateResponseInput = z.input<typeof waitlistCreateResponseSchema>
export type WaitlistCreateResponseParsed = z.output<typeof waitlistCreateResponseSchema>
