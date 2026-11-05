import { z } from 'zod'
import { messageResponseSchema } from '../shared/message-response.js'

export const verifyEmailRequestSchema = z.object({
  token: z.guid(),
})

export type VerifyEmailRequestInput = z.input<typeof verifyEmailRequestSchema>
export type VerifyEmailRequestParsed = z.output<typeof verifyEmailRequestSchema>

export const verifyEmailResponseSchema = messageResponseSchema

export type VerifyEmailResponseInput = z.input<typeof verifyEmailResponseSchema>
export type VerifyEmailResponseParsed = z.output<typeof verifyEmailResponseSchema>
