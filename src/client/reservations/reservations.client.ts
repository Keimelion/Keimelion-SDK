import { HttpMethod } from '../../enums/http.js'
import { noContentResponseSchema } from '../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../schemas/_shared/no-content.js'
import { reservationsCreateResponseSchema } from '../../schemas/reservations/create-reservation.js'
import type {
  ReservationsCreateRequestInput,
  ReservationsCreateResponseParsed,
} from '../../schemas/reservations/create-reservation.js'
import { reservationsGetResponseSchema } from '../../schemas/reservations/get-reservation.js'
import type { ReservationsGetResponseParsed } from '../../schemas/reservations/get-reservation.js'
import type { HttpClient, RequestAuth } from '../_core/http-client.js'
import { ReservationsPaths } from './reservations.paths.js'

// Anonymous holders authenticate with the `rsv_…` token returned by `create`.
export interface ReservationAccessOptions {
  reservationToken?: string
}

function reservationAuth(options: ReservationAccessOptions): { auth?: RequestAuth } {
  return options.reservationToken === undefined ? {} : { auth: { token: options.reservationToken } }
}

export interface ReservationsClient {
  create(input: ReservationsCreateRequestInput): Promise<ReservationsCreateResponseParsed>
  get(id: string, options?: ReservationAccessOptions): Promise<ReservationsGetResponseParsed>
  delete(id: string, options?: ReservationAccessOptions): Promise<NoContentResponseParsed>
}

export function createReservationsClient(http: HttpClient): ReservationsClient {
  return {
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: ReservationsPaths.CREATE,
        body: input,
        responseSchema: reservationsCreateResponseSchema,
      }),
    get: (id, options = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: ReservationsPaths.GET,
        pathParams: { id },
        ...reservationAuth(options),
        responseSchema: reservationsGetResponseSchema,
      }),
    delete: (id, options = {}) =>
      http.request({
        method: HttpMethod.DELETE,
        path: ReservationsPaths.DELETE,
        pathParams: { id },
        ...reservationAuth(options),
        responseSchema: noContentResponseSchema,
      }),
  }
}
