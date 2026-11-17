import { z } from 'zod'
import { collaboratorDetailSchema } from '../_shared/list-member.js'
import { collaboratorInviteTokenSchema } from './invite-token.js'

export const collaboratorsAcceptInviteRequestSchema = z.strictObject({
  token: collaboratorInviteTokenSchema,
})

export type CollaboratorsAcceptInviteRequestInput = z.input<
  typeof collaboratorsAcceptInviteRequestSchema
>
export type CollaboratorsAcceptInviteRequestParsed = z.output<
  typeof collaboratorsAcceptInviteRequestSchema
>

export const collaboratorsAcceptInviteResponseSchema = z.object({
  invite: collaboratorDetailSchema,
})

export type CollaboratorsAcceptInviteResponseInput = z.input<
  typeof collaboratorsAcceptInviteResponseSchema
>
export type CollaboratorsAcceptInviteResponseParsed = z.output<
  typeof collaboratorsAcceptInviteResponseSchema
>
