import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import {
  adminShopsGetResponseSchema,
  adminShopsListResponseSchema,
} from '../../../schemas/admin/shops/admin-shop-detail.js'
import type {
  AdminShopsGetQueryInput,
  AdminShopsGetResponseParsed,
  AdminShopsListFilters,
  AdminShopsListQueryInput,
  AdminShopsListResponseParsed,
} from '../../../schemas/admin/shops/admin-shop-detail.js'
import { adminShopsCreateResponseSchema } from '../../../schemas/admin/shops/create-shop.js'
import type {
  AdminShopsCreateRequestInput,
  AdminShopsCreateResponseParsed,
} from '../../../schemas/admin/shops/create-shop.js'
import { adminShopsUpdateResponseSchema } from '../../../schemas/admin/shops/update-shop.js'
import type {
  AdminShopsUpdateRequestInput,
  AdminShopsUpdateResponseParsed,
} from '../../../schemas/admin/shops/update-shop.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminShopsPaths } from './admin-shops.paths.js'

export interface AdminShopsClient {
  list(
    query?: AdminShopsListQueryInput & AdminShopsListFilters,
  ): Promise<AdminShopsListResponseParsed>
  create(input: AdminShopsCreateRequestInput): Promise<AdminShopsCreateResponseParsed>
  get(id: string, query?: AdminShopsGetQueryInput): Promise<AdminShopsGetResponseParsed>
  update(id: string, input: AdminShopsUpdateRequestInput): Promise<AdminShopsUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
}

export function createAdminShopsClient(http: HttpClient): AdminShopsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminShopsPaths.LIST,
        query,
        responseSchema: adminShopsListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminShopsPaths.CREATE,
        body: input,
        responseSchema: adminShopsCreateResponseSchema,
      }),
    get: (id, query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminShopsPaths.GET,
        pathParams: { id },
        query,
        responseSchema: adminShopsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminShopsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminShopsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminShopsPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
  }
}
