import { HttpMethod } from '../../../enums/http.js'
import { noContentResponseSchema } from '../../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../../schemas/_shared/no-content.js'
import {
  adminReservationsGetResponseSchema,
  adminReservationsListResponseSchema,
} from '../../../schemas/admin/reservations/admin-reservation-detail.js'
import type {
  AdminReservationsGetResponseParsed,
  AdminReservationsListQueryInput,
  AdminReservationsListResponseParsed,
} from '../../../schemas/admin/reservations/admin-reservation-detail.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminReservationsPaths } from './admin-reservations.paths.js'

export interface AdminReservationsClient {
  list(query?: AdminReservationsListQueryInput): Promise<AdminReservationsListResponseParsed>
  get(id: string): Promise<AdminReservationsGetResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
}

export function createAdminReservationsClient(http: HttpClient): AdminReservationsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminReservationsPaths.LIST,
        query,
        responseSchema: adminReservationsListResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminReservationsPaths.GET,
        pathParams: { id },
        responseSchema: adminReservationsGetResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: AdminReservationsPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
  }
}
