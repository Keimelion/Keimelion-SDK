import { z } from 'zod'
import { INVITE_STATUS_VALUES } from '../../enums/invite-status.js'
import { LIST_USER_ROLE_VALUES } from '../../enums/list-user-role.js'
import { imageDetailSchema } from './image-detail.js'
import { isoDateTimeSchema } from './timestamp.js'

// Identity of a list member as seen by the other members: narrower than userDetailSchema.
export const listMemberSummarySchema = z.object({
  id: z.guid(),
  email: z.string(),
  username: z.string().nullable(),
  avatar: imageDetailSchema.nullable(),
})

export type ListMemberSummaryInput = z.input<typeof listMemberSummarySchema>
export type ListMemberSummaryParsed = z.output<typeof listMemberSummarySchema>

export const collaboratorSummarySchema = z.object({
  user: listMemberSummarySchema.nullable(),
  invitedEmail: z.string().nullable(),
  status: z.enum(INVITE_STATUS_VALUES),
  role: z.enum(LIST_USER_ROLE_VALUES),
})

export type CollaboratorSummaryInput = z.input<typeof collaboratorSummarySchema>
export type CollaboratorSummaryParsed = z.output<typeof collaboratorSummarySchema>

export const collaboratorDetailSchema = z.object({
  id: z.guid(),
  listId: z.guid(),
  user: listMemberSummarySchema.nullable(),
  invitedEmail: z.string().nullable(),
  inviteStatus: z.enum(INVITE_STATUS_VALUES),
  role: z.enum(LIST_USER_ROLE_VALUES),
  acceptedAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type CollaboratorDetailInput = z.input<typeof collaboratorDetailSchema>
export type CollaboratorDetailParsed = z.output<typeof collaboratorDetailSchema>
