import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import { adminOccasionTypesListResponseSchema } from '../../../schemas/admin/occasion-types/admin-occasion-type-detail.js'
import type {
  AdminOccasionTypesListQueryInput,
  AdminOccasionTypesListResponseParsed,
} from '../../../schemas/admin/occasion-types/admin-occasion-type-detail.js'
import { adminOccasionTypesCreateResponseSchema } from '../../../schemas/admin/occasion-types/create-occasion-type.js'
import type {
  AdminOccasionTypesCreateRequestInput,
  AdminOccasionTypesCreateResponseParsed,
} from '../../../schemas/admin/occasion-types/create-occasion-type.js'
import { adminOccasionTypesUpdateResponseSchema } from '../../../schemas/admin/occasion-types/update-occasion-type.js'
import type {
  AdminOccasionTypesUpdateRequestInput,
  AdminOccasionTypesUpdateResponseParsed,
} from '../../../schemas/admin/occasion-types/update-occasion-type.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminOccasionTypesPaths } from './admin-occasion-types.paths.js'

export interface AdminOccasionTypesClient {
  list(query?: AdminOccasionTypesListQueryInput): Promise<AdminOccasionTypesListResponseParsed>
  create(
    input: AdminOccasionTypesCreateRequestInput,
  ): Promise<AdminOccasionTypesCreateResponseParsed>
  update(
    id: string,
    input: AdminOccasionTypesUpdateRequestInput,
  ): Promise<AdminOccasionTypesUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
}

export function createAdminOccasionTypesClient(http: HttpClient): AdminOccasionTypesClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminOccasionTypesPaths.LIST,
        query,
        responseSchema: adminOccasionTypesListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: AdminOccasionTypesPaths.CREATE,
        body: input,
        responseSchema: adminOccasionTypesCreateResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminOccasionTypesPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminOccasionTypesUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminOccasionTypesPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
  }
}
