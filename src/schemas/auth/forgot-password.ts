import { z } from 'zod'
import { messageResponseSchema } from '../_shared/message-response.js'
import { emailSchema } from '../_shared/email.js'

export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordRequestInput = z.input<typeof forgotPasswordRequestSchema>
export type ForgotPasswordRequestParsed = z.output<typeof forgotPasswordRequestSchema>

export const forgotPasswordResponseSchema = messageResponseSchema

export type ForgotPasswordResponseInput = z.input<typeof forgotPasswordResponseSchema>
export type ForgotPasswordResponseParsed = z.output<typeof forgotPasswordResponseSchema>
