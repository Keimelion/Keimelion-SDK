import { HttpMethod } from '../../../enums/http.js'
import { messageResponseSchema } from '../../../schemas/_shared/message-response.js'
import type { MessageResponseParsed } from '../../../schemas/_shared/message-response.js'
import {
  adminItemsGetResponseSchema,
  adminItemsListResponseSchema,
} from '../../../schemas/admin/items/admin-item-detail.js'
import type {
  AdminItemsGetResponseParsed,
  AdminItemsListFilters,
  AdminItemsListQueryInput,
  AdminItemsListResponseParsed,
} from '../../../schemas/admin/items/admin-item-detail.js'
import { adminItemsCreateResponseSchema } from '../../../schemas/admin/items/create-item.js'
import type {
  AdminItemsCreateRequestInput,
  AdminItemsCreateResponseParsed,
} from '../../../schemas/admin/items/create-item.js'
import {
  adminItemsCreateSourceResponseSchema,
  adminItemsUpdateSourceResponseSchema,
} from '../../../schemas/admin/items/item-sources.js'
import type {
  AdminItemsCreateSourceRequestInput,
  AdminItemsCreateSourceResponseParsed,
  AdminItemsUpdateSourceRequestInput,
  AdminItemsUpdateSourceResponseParsed,
} from '../../../schemas/admin/items/item-sources.js'
import { adminItemsUpdateResponseSchema } from '../../../schemas/admin/items/update-item.js'
import type {
  AdminItemsUpdateRequestInput,
  AdminItemsUpdateResponseParsed,
} from '../../../schemas/admin/items/update-item.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminItemsPaths } from './admin-items.paths.js'

export interface AdminItemsClient {
  list(
    query?: AdminItemsListQueryInput & AdminItemsListFilters,
  ): Promise<AdminItemsListResponseParsed>
  create(input: AdminItemsCreateRequestInput | FormData): Promise<AdminItemsCreateResponseParsed>
  get(id: string): Promise<AdminItemsGetResponseParsed>
  update(
    id: string,
    input: AdminItemsUpdateRequestInput | FormData,
  ): Promise<AdminItemsUpdateResponseParsed>
  delete(id: string): Promise<MessageResponseParsed>
  createSource(
    id: string,
    input: AdminItemsCreateSourceRequestInput,
  ): Promise<AdminItemsCreateSourceResponseParsed>
  updateSource(
    id: string,
    sourceId: string,
    input: AdminItemsUpdateSourceRequestInput,
  ): Promise<AdminItemsUpdateSourceResponseParsed>
  deleteSource(id: string, sourceId: string): Promise<MessageResponseParsed>
}

export function createAdminItemsClient(http: HttpClient): AdminItemsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminItemsPaths.LIST,
        query,
        responseSchema: adminItemsListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminItemsPaths.CREATE,
        body: input,
        responseSchema: adminItemsCreateResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminItemsPaths.GET,
        pathParams: { id },
        responseSchema: adminItemsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminItemsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminItemsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminItemsPaths.DELETE,
        pathParams: { id },
        responseSchema: messageResponseSchema,
      }),
    createSource: (id, input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminItemsPaths.CREATE_SOURCE,
        pathParams: { id },
        body: input,
        responseSchema: adminItemsCreateSourceResponseSchema,
      }),
    updateSource: (id, sourceId, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminItemsPaths.UPDATE_SOURCE,
        pathParams: { id, sourceId },
        body: input,
        responseSchema: adminItemsUpdateSourceResponseSchema,
      }),
    deleteSource: (id, sourceId) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminItemsPaths.DELETE_SOURCE,
        pathParams: { id, sourceId },
        responseSchema: messageResponseSchema,
      }),
  }
}
