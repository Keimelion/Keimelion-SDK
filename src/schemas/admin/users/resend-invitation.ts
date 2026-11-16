import { z } from 'zod'
import { adminUserDetailSchema } from './admin-user-detail.js'

export const adminUsersResendInvitationResponseSchema = z.object({
  user: adminUserDetailSchema,
})

export type AdminUsersResendInvitationResponseInput = z.input<
  typeof adminUsersResendInvitationResponseSchema
>
export type AdminUsersResendInvitationResponseParsed = z.output<
  typeof adminUsersResendInvitationResponseSchema
>
