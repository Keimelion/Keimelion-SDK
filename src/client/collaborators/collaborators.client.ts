import { HttpMethod } from '../../enums/http.js'
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
import type { HttpClient } from '../_core/http-client.js'
import { CollaboratorsPaths } from './collaborators.paths.js'

export interface CollaboratorsClient {
  createInvite(
    id: string,
    input: CollaboratorsCreateInviteRequestInput,
  ): Promise<CollaboratorsCreateInviteResponseParsed>
  acceptInvite(
    input: CollaboratorsAcceptInviteRequestInput,
  ): Promise<CollaboratorsAcceptInviteResponseParsed>
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
    acceptInvite: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: CollaboratorsPaths.ACCEPT_INVITE,
        body: input,
        responseSchema: collaboratorsAcceptInviteResponseSchema,
      }),
  }
}
