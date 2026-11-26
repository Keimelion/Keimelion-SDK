import { z } from 'zod'
import { messageResponseSchema } from '../_shared/message-response.js'

export const verifyEmailRequestSchema = z.object({
  token: z.guid(),
})

export type VerifyEmailRequestInput = z.input<typeof verifyEmailRequestSchema>
export type VerifyEmailRequestParsed = z.output<typeof verifyEmailRequestSchema>

// A used link keeps answering 200 until it expires: alreadyVerified tells a repeat click apart
// from the first one. userId lets a client check that a stored session belongs to the verified
// account before resuming it. An expired, unknown or replaced token answers 400 BAD_REQUEST.
export const verifyEmailResponseSchema = messageResponseSchema.extend({
  userId: z.guid(),
  alreadyVerified: z.boolean(),
})

export type VerifyEmailResponseInput = z.input<typeof verifyEmailResponseSchema>
export type VerifyEmailResponseParsed = z.output<typeof verifyEmailResponseSchema>
