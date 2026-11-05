import { z } from 'zod'

export const emailSchema = z.email().transform((value) => value.toLowerCase().trim())

export type EmailInput = z.input<typeof emailSchema>
export type EmailParsed = z.output<typeof emailSchema>
