import { z } from 'zod'
import { messageResponseSchema } from '../shared/message-response.js'

export const logoutRequestSchema = z.object({
  refreshToken: z.string().min(1).optional(),
})

export type LogoutRequestInput = z.input<typeof logoutRequestSchema>
export type LogoutRequestParsed = z.output<typeof logoutRequestSchema>

export const logoutResponseSchema = messageResponseSchema

export type LogoutResponseInput = z.input<typeof logoutResponseSchema>
export type LogoutResponseParsed = z.output<typeof logoutResponseSchema>
