import { HttpMethod } from '../../../enums/http.js'
import { adminCollaboratorInvitesListResponseSchema } from '../../../schemas/admin/collaborator-invites/admin-collaborator-invite-detail.js'
import type {
  AdminCollaboratorInvitesListQueryInput,
  AdminCollaboratorInvitesListResponseParsed,
} from '../../../schemas/admin/collaborator-invites/admin-collaborator-invite-detail.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminCollaboratorInvitesPaths } from './admin-collaborator-invites.paths.js'

export interface AdminCollaboratorInvitesClient {
  list(
    query?: AdminCollaboratorInvitesListQueryInput,
  ): Promise<AdminCollaboratorInvitesListResponseParsed>
}

export function createAdminCollaboratorInvitesClient(
  http: HttpClient,
): AdminCollaboratorInvitesClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminCollaboratorInvitesPaths.LIST,
        query,
        responseSchema: adminCollaboratorInvitesListResponseSchema,
      }),
  }
}
