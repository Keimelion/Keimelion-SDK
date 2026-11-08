import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import {
  adminTagsGetResponseSchema,
  adminTagsListResponseSchema,
} from '../../../schemas/admin/tags/admin-tag-detail.js'
import type {
  AdminTagsGetResponseParsed,
  AdminTagsListFilters,
  AdminTagsListQueryInput,
  AdminTagsListResponseParsed,
} from '../../../schemas/admin/tags/admin-tag-detail.js'
import { adminTagsCreateResponseSchema } from '../../../schemas/admin/tags/create-tag.js'
import type {
  AdminTagsCreateRequestInput,
  AdminTagsCreateResponseParsed,
} from '../../../schemas/admin/tags/create-tag.js'
import { adminTagsUpdateResponseSchema } from '../../../schemas/admin/tags/update-tag.js'
import type {
  AdminTagsUpdateRequestInput,
  AdminTagsUpdateResponseParsed,
} from '../../../schemas/admin/tags/update-tag.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminTagsPaths } from './admin-tags.paths.js'

export interface AdminTagsClient {
  list(query?: AdminTagsListQueryInput & AdminTagsListFilters): Promise<AdminTagsListResponseParsed>
  create(input: AdminTagsCreateRequestInput): Promise<AdminTagsCreateResponseParsed>
  get(id: string): Promise<AdminTagsGetResponseParsed>
  update(id: string, input: AdminTagsUpdateRequestInput): Promise<AdminTagsUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
}

export function createAdminTagsClient(http: HttpClient): AdminTagsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminTagsPaths.LIST,
        query,
        responseSchema: adminTagsListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminTagsPaths.CREATE,
        body: input,
        responseSchema: adminTagsCreateResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminTagsPaths.GET,
        pathParams: { id },
        responseSchema: adminTagsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminTagsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminTagsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminTagsPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
  }
}
