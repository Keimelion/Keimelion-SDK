import { z } from 'zod'

// Normalise before validating: z.email() alone would reject surrounding whitespace.
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email())

export type EmailInput = z.input<typeof emailSchema>
export type EmailParsed = z.output<typeof emailSchema>
