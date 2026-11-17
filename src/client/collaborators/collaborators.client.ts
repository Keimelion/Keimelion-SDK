import { HttpMethod } from '../../enums/http.js'
import { noContentResponseSchema } from '../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../schemas/_shared/no-content.js'
import { collaboratorsAcceptInviteResponseSchema } from '../../schemas/collaborators/accept-invite.js'
import type {
  CollaboratorsAcceptInviteRequestInput,
  CollaboratorsAcceptInviteResponseParsed,
} from '../../schemas/collaborators/accept-invite.js'
import { collaboratorsCreateInviteResponseSchema } from '../../schemas/collaborators/create-invite.js'
import type {
  CollaboratorsCreateInviteRequestInput,
  CollaboratorsCreateInviteResponseParsed,
} from '../../schemas/collaborators/create-invite.js'
import type { CollaboratorsDeclineInviteRequestInput } from '../../schemas/collaborators/decline-invite.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { CollaboratorsPaths } from './collaborators.paths.js'

export interface CollaboratorsClient {
  createInvite(
    id: string,
    input: CollaboratorsCreateInviteRequestInput,
  ): Promise<CollaboratorsCreateInviteResponseParsed>
  revokeInvite(id: string, inviteId: string): Promise<NoContentResponseParsed>
  remove(id: string, userId: string): Promise<NoContentResponseParsed>
  leave(id: string): Promise<NoContentResponseParsed>
  acceptInvite(
    input: CollaboratorsAcceptInviteRequestInput,
  ): Promise<CollaboratorsAcceptInviteResponseParsed>
  declineInvite(input: CollaboratorsDeclineInviteRequestInput): Promise<NoContentResponseParsed>
}

export function createCollaboratorsClient(http: HttpClient): CollaboratorsClient {
  return {
    createInvite: (id, input) =>
      http.request({
        method: HttpMethod.POST,
        path: CollaboratorsPaths.CREATE_INVITE,
        pathParams: { id },
        body: input,
        responseSchema: collaboratorsCreateInviteResponseSchema,
      }),
    revokeInvite: (id, inviteId) =>
      http.request({
        method: HttpMethod.DELETE,
        path: CollaboratorsPaths.REVOKE_INVITE,
        pathParams: { id, inviteId },
        responseSchema: noContentResponseSchema,
      }),
    remove: (id, userId) =>
      http.request({
        method: HttpMethod.DELETE,
        path: CollaboratorsPaths.REMOVE_COLLABORATOR,
        pathParams: { id, userId },
        responseSchema: noContentResponseSchema,
      }),
    leave: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: CollaboratorsPaths.LEAVE_LIST,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
    acceptInvite: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: CollaboratorsPaths.ACCEPT_INVITE,
        body: input,
        responseSchema: collaboratorsAcceptInviteResponseSchema,
      }),
    declineInvite: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: CollaboratorsPaths.DECLINE_INVITE,
        body: input,
        auth: RequestAuthMode.NONE,
        responseSchema: noContentResponseSchema,
      }),
  }
}
