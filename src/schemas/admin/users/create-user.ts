import { z } from 'zod'
import { USER_ROLE_VALUES } from '../../../enums/user-role.js'
import { usernameSchema } from '../../_shared/username.js'
import { adminUserDetailSchema } from './admin-user-detail.js'

export const adminUsersCreateRequestSchema = z.strictObject({
  email: z.email().toLowerCase(),
  username: usernameSchema.nullish().transform((value) => value ?? null),
  role: z.enum(USER_ROLE_VALUES),
})

export type AdminUsersCreateRequestInput = z.input<typeof adminUsersCreateRequestSchema>
export type AdminUsersCreateRequestParsed = z.output<typeof adminUsersCreateRequestSchema>

export const adminUsersCreateResponseSchema = z.object({
  user: adminUserDetailSchema,
})

export type AdminUsersCreateResponseInput = z.input<typeof adminUsersCreateResponseSchema>
export type AdminUsersCreateResponseParsed = z.output<typeof adminUsersCreateResponseSchema>
