import { z } from 'zod'
import { userDetailSchema } from '../users/user-detail.js'
import { emailSchema } from './email.js'

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
})

export type LoginRequestInput = z.input<typeof loginRequestSchema>
export type LoginRequestParsed = z.output<typeof loginRequestSchema>

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: userDetailSchema,
})

export type LoginResponseInput = z.input<typeof loginResponseSchema>
export type LoginResponseParsed = z.output<typeof loginResponseSchema>
