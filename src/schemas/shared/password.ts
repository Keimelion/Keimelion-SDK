import { z } from 'zod'

export const MIN_PASSWORD_LENGTH = 8
export const MAX_PASSWORD_LENGTH = 72

export const passwordSchema = z.string().min(MIN_PASSWORD_LENGTH).max(MAX_PASSWORD_LENGTH)

export type PasswordInput = z.input<typeof passwordSchema>
export type PasswordParsed = z.output<typeof passwordSchema>
