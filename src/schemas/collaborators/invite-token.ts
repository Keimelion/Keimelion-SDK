import { z } from 'zod'

export const COLLABORATOR_INVITE_TOKEN_HEX_LENGTH = 64

const INVITE_TOKEN_HEX_REGEX = /^[a-f0-9]+$/
const INVITE_TOKEN_HEX_MESSAGE = 'Invitation token must be a hex-encoded value'

export const collaboratorInviteTokenSchema = z
  .string()
  .length(COLLABORATOR_INVITE_TOKEN_HEX_LENGTH)
  .regex(INVITE_TOKEN_HEX_REGEX, INVITE_TOKEN_HEX_MESSAGE)

export type CollaboratorInviteTokenInput = z.input<typeof collaboratorInviteTokenSchema>
export type CollaboratorInviteTokenParsed = z.output<typeof collaboratorInviteTokenSchema>
