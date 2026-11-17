import { z } from 'zod'
import { collaboratorInviteTokenSchema } from './invite-token.js'

export const collaboratorsDeclineInviteRequestSchema = z.strictObject({
  token: collaboratorInviteTokenSchema,
})

export type CollaboratorsDeclineInviteRequestInput = z.input<
  typeof collaboratorsDeclineInviteRequestSchema
>
export type CollaboratorsDeclineInviteRequestParsed = z.output<
  typeof collaboratorsDeclineInviteRequestSchema
>
