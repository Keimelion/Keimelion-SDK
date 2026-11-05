import { z } from 'zod'

export const USERNAME_MIN_LENGTH = 1
export const USERNAME_MAX_LENGTH = 100
export const USERNAME_REGEX = new RegExp(
  `^[\\p{L}\\p{N}_-]{${String(USERNAME_MIN_LENGTH)},${String(USERNAME_MAX_LENGTH)}}$`,
  'u',
)

export const usernameSchema = z
  .string()
  .trim()
  .regex(
    USERNAME_REGEX,
    `username must be ${String(USERNAME_MIN_LENGTH)}-${String(USERNAME_MAX_LENGTH)} letters, digits, underscores, or dashes`,
  )

export type UsernameInput = z.input<typeof usernameSchema>
export type UsernameParsed = z.output<typeof usernameSchema>
