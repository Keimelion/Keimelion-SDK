import { z } from 'zod'
import { INVITE_STATUS_VALUES } from '../../../enums/invite-status.js'
import { collaboratorDetailSchema, listMemberSummarySchema } from '../../_shared/list-member.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'

export const adminCollaboratorInviteDetailSchema = collaboratorDetailSchema.extend({
  list: z.object({
    id: z.guid(),
    title: z.string(),
    slug: z.string(),
  }),
  invitedBy: listMemberSummarySchema.nullable(),
  isExpired: z.boolean(),
})

export type AdminCollaboratorInviteDetailInput = z.input<typeof adminCollaboratorInviteDetailSchema>
export type AdminCollaboratorInviteDetailParsed = z.output<
  typeof adminCollaboratorInviteDetailSchema
>

export const adminCollaboratorInvitesListQuerySchema = paginationQuerySchema.extend({
  inviteStatus: z.enum(INVITE_STATUS_VALUES).optional(),
})

export type AdminCollaboratorInvitesListQueryInput = z.input<
  typeof adminCollaboratorInvitesListQuerySchema
>
export type AdminCollaboratorInvitesListQueryParsed = z.output<
  typeof adminCollaboratorInvitesListQuerySchema
>

export const adminCollaboratorInvitesListResponseSchema = paginatedResponseSchema(
  adminCollaboratorInviteDetailSchema,
)

export type AdminCollaboratorInvitesListResponseInput = z.input<
  typeof adminCollaboratorInvitesListResponseSchema
>
export type AdminCollaboratorInvitesListResponseParsed = z.output<
  typeof adminCollaboratorInvitesListResponseSchema
>
