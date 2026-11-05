import { z } from 'zod'

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type MessageResponseInput = z.input<typeof messageResponseSchema>
export type MessageResponseParsed = z.output<typeof messageResponseSchema>
