import { z } from 'zod'
import { USER_ROLE_VALUES } from '../../../enums/user-role.js'
import { adminUserDetailSchema } from './admin-user-detail.js'

export const adminUsersUpdateRequestSchema = z.object({
  clearAvatar: z.boolean().optional(),
  isMarketingOptedIn: z.boolean().optional(),
  role: z.enum(USER_ROLE_VALUES).optional(),
})

export type AdminUsersUpdateRequestInput = z.input<typeof adminUsersUpdateRequestSchema>
export type AdminUsersUpdateRequestParsed = z.output<typeof adminUsersUpdateRequestSchema>

export const adminUsersUpdateResponseSchema = z.object({
  user: adminUserDetailSchema,
})

export type AdminUsersUpdateResponseInput = z.input<typeof adminUsersUpdateResponseSchema>
export type AdminUsersUpdateResponseParsed = z.output<typeof adminUsersUpdateResponseSchema>
