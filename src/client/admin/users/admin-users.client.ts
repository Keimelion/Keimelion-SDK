import { HttpMethod } from '../../../enums/http.js'
import { messageResponseSchema } from '../../../schemas/_shared/message-response.js'
import type { MessageResponseParsed } from '../../../schemas/_shared/message-response.js'
import {
  adminUsersGetResponseSchema,
  adminUsersListResponseSchema,
} from '../../../schemas/admin/users/admin-user-detail.js'
import type {
  AdminUsersGetResponseParsed,
  AdminUsersListFilters,
  AdminUsersListQueryInput,
  AdminUsersListResponseParsed,
} from '../../../schemas/admin/users/admin-user-detail.js'
import { adminUsersCreateResponseSchema } from '../../../schemas/admin/users/create-user.js'
import type {
  AdminUsersCreateRequestInput,
  AdminUsersCreateResponseParsed,
} from '../../../schemas/admin/users/create-user.js'
import { adminUsersUpdateResponseSchema } from '../../../schemas/admin/users/update-user.js'
import type {
  AdminUsersUpdateRequestInput,
  AdminUsersUpdateResponseParsed,
} from '../../../schemas/admin/users/update-user.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminUsersPaths } from './admin-users.paths.js'

export interface AdminUsersClient {
  list(
    query?: AdminUsersListQueryInput & AdminUsersListFilters,
  ): Promise<AdminUsersListResponseParsed>
  create(input: AdminUsersCreateRequestInput): Promise<AdminUsersCreateResponseParsed>
  get(id: string): Promise<AdminUsersGetResponseParsed>
  update(id: string, input: AdminUsersUpdateRequestInput): Promise<AdminUsersUpdateResponseParsed>
  delete(id: string): Promise<MessageResponseParsed>
}

export function createAdminUsersClient(http: HttpClient): AdminUsersClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminUsersPaths.LIST,
        query,
        responseSchema: adminUsersListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminUsersPaths.CREATE,
        body: input,
        responseSchema: adminUsersCreateResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminUsersPaths.GET,
        pathParams: { id },
        responseSchema: adminUsersGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminUsersPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminUsersUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminUsersPaths.DELETE,
        pathParams: { id },
        responseSchema: messageResponseSchema,
      }),
  }
}
