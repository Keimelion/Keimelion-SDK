import { z } from 'zod'
import { collaboratorDetailSchema } from '../_shared/list-member.js'

export const collaboratorsCreateInviteRequestSchema = z.strictObject({
  email: z.email().toLowerCase(),
})

export type CollaboratorsCreateInviteRequestInput = z.input<
  typeof collaboratorsCreateInviteRequestSchema
>
export type CollaboratorsCreateInviteRequestParsed = z.output<
  typeof collaboratorsCreateInviteRequestSchema
>

export const collaboratorsCreateInviteResponseSchema = z.object({
  invite: collaboratorDetailSchema,
})

export type CollaboratorsCreateInviteResponseInput = z.input<
  typeof collaboratorsCreateInviteResponseSchema
>
export type CollaboratorsCreateInviteResponseParsed = z.output<
  typeof collaboratorsCreateInviteResponseSchema
>
