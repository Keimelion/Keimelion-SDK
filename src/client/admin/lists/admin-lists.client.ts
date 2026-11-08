import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import {
  adminListsGetResponseSchema,
  adminListsListResponseSchema,
  adminListsRestoreResponseSchema,
} from '../../../schemas/admin/lists/admin-list-detail.js'
import type {
  AdminListsGetQueryInput,
  AdminListsGetResponseParsed,
  AdminListsListFilters,
  AdminListsListQueryInput,
  AdminListsListResponseParsed,
  AdminListsRestoreResponseParsed,
} from '../../../schemas/admin/lists/admin-list-detail.js'
import { adminListsListItemsResponseSchema } from '../../../schemas/admin/lists/list-list-items.js'
import type {
  AdminListsListItemsQueryInput,
  AdminListsListItemsResponseParsed,
} from '../../../schemas/admin/lists/list-list-items.js'
import { adminListsUpdateResponseSchema } from '../../../schemas/admin/lists/update-list.js'
import type {
  AdminListsUpdateRequestInput,
  AdminListsUpdateResponseParsed,
} from '../../../schemas/admin/lists/update-list.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminListsPaths } from './admin-lists.paths.js'

export interface AdminListsClient {
  list(
    query?: AdminListsListQueryInput & AdminListsListFilters,
  ): Promise<AdminListsListResponseParsed>
  get(id: string, query?: AdminListsGetQueryInput): Promise<AdminListsGetResponseParsed>
  update(id: string, input: AdminListsUpdateRequestInput): Promise<AdminListsUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
  restore(id: string): Promise<AdminListsRestoreResponseParsed>
  listItems(
    id: string,
    query?: AdminListsListItemsQueryInput,
  ): Promise<AdminListsListItemsResponseParsed>
}

export function createAdminListsClient(http: HttpClient): AdminListsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminListsPaths.LIST,
        query,
        responseSchema: adminListsListResponseSchema,
      }),
    get: (id, query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminListsPaths.GET,
        pathParams: { id },
        query,
        responseSchema: adminListsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminListsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminListsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminListsPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
    restore: (id) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminListsPaths.RESTORE,
        pathParams: { id },
        responseSchema: adminListsRestoreResponseSchema,
      }),
    listItems: (id, query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminListsPaths.LIST_ITEMS,
        pathParams: { id },
        query,
        responseSchema: adminListsListItemsResponseSchema,
      }),
  }
}
