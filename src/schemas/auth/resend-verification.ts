import { z } from 'zod'
import { messageResponseSchema } from '../_shared/message-response.js'
import { emailSchema } from '../_shared/email.js'

// Minimum delay between two verification links for one account: a resend inside it sends nothing.
export const RESEND_VERIFICATION_COOLDOWN_SECONDS = 60

export const resendVerificationRequestSchema = z.object({
  email: emailSchema,
})

export type ResendVerificationRequestInput = z.input<typeof resendVerificationRequestSchema>
export type ResendVerificationRequestParsed = z.output<typeof resendVerificationRequestSchema>

// Same body whether or not an email was sent (unknown, verified, banned or deleted account,
// cooldown): the endpoint never reveals whether an address is registered.
export const resendVerificationResponseSchema = messageResponseSchema

export type ResendVerificationResponseInput = z.input<typeof resendVerificationResponseSchema>
export type ResendVerificationResponseParsed = z.output<typeof resendVerificationResponseSchema>
