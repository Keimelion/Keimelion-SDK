import { z } from 'zod'
import { passwordSchema } from '../_shared/password.js'
import { messageResponseSchema } from '../_shared/message-response.js'

export const resetPasswordRequestSchema = z.object({
  passwordResetToken: z.string().min(1),
  password: passwordSchema,
})

export type ResetPasswordRequestInput = z.input<typeof resetPasswordRequestSchema>
export type ResetPasswordRequestParsed = z.output<typeof resetPasswordRequestSchema>

export const resetPasswordResponseSchema = messageResponseSchema

export type ResetPasswordResponseInput = z.input<typeof resetPasswordResponseSchema>
export type ResetPasswordResponseParsed = z.output<typeof resetPasswordResponseSchema>
