import { z } from 'zod'
import { passwordSchema } from '../_shared/password.js'

export const usersChangePasswordRequestSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must differ from current password',
    path: ['newPassword'],
  })

export type UsersChangePasswordRequestInput = z.input<typeof usersChangePasswordRequestSchema>
export type UsersChangePasswordRequestParsed = z.output<typeof usersChangePasswordRequestSchema>
