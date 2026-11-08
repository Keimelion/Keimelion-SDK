import { z } from 'zod'
import { collaboratorDetailSchema } from '../_shared/list-member.js'

export const COLLABORATOR_INVITE_TOKEN_HEX_LENGTH = 64

const INVITE_TOKEN_HEX_REGEX = /^[a-f0-9]+$/
const INVITE_TOKEN_HEX_MESSAGE = 'Invitation token must be a hex-encoded value'

export const collaboratorsAcceptInviteRequestSchema = z.strictObject({
  token: z
    .string()
    .length(COLLABORATOR_INVITE_TOKEN_HEX_LENGTH)
    .regex(INVITE_TOKEN_HEX_REGEX, INVITE_TOKEN_HEX_MESSAGE),
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
