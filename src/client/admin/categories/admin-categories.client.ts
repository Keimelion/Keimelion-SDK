import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import {
  adminCategoriesGetResponseSchema,
  adminCategoriesListResponseSchema,
} from '../../../schemas/admin/categories/admin-category-detail.js'
import type {
  AdminCategoriesGetResponseParsed,
  AdminCategoriesListResponseParsed,
} from '../../../schemas/admin/categories/admin-category-detail.js'
import { adminCategoriesCreateResponseSchema } from '../../../schemas/admin/categories/create-category.js'
import type {
  AdminCategoriesCreateRequestInput,
  AdminCategoriesCreateResponseParsed,
} from '../../../schemas/admin/categories/create-category.js'
import { adminCategoriesUpdateResponseSchema } from '../../../schemas/admin/categories/update-category.js'
import type {
  AdminCategoriesUpdateRequestInput,
  AdminCategoriesUpdateResponseParsed,
} from '../../../schemas/admin/categories/update-category.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminCategoriesPaths } from './admin-categories.paths.js'

export interface AdminCategoriesClient {
  list(): Promise<AdminCategoriesListResponseParsed>
  create(input: AdminCategoriesCreateRequestInput): Promise<AdminCategoriesCreateResponseParsed>
  get(id: string): Promise<AdminCategoriesGetResponseParsed>
  update(
    id: string,
    input: AdminCategoriesUpdateRequestInput,
  ): Promise<AdminCategoriesUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
}

export function createAdminCategoriesClient(http: HttpClient): AdminCategoriesClient {
  return {
    list: () =>
      http.request({
        method: HttpMethod.GET,
        path: AdminCategoriesPaths.LIST,
        responseSchema: adminCategoriesListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminCategoriesPaths.CREATE,
        body: input,
        responseSchema: adminCategoriesCreateResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminCategoriesPaths.GET,
        pathParams: { id },
        responseSchema: adminCategoriesGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminCategoriesPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminCategoriesUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminCategoriesPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
  }
}
