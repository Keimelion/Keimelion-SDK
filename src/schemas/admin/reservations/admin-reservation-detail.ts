import { z } from 'zod'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import {
  RESERVATION_SORT_FIELDS,
  reservationDetailSchema,
} from '../../_shared/reservation-detail.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import { userDetailSchema } from '../../_shared/user-detail.js'

export const adminReservationDetailSchema = reservationDetailSchema.extend({
  user: userDetailSchema.nullable(),
})

export type AdminReservationDetailInput = z.input<typeof adminReservationDetailSchema>
export type AdminReservationDetailParsed = z.output<typeof adminReservationDetailSchema>

export const adminReservationsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(RESERVATION_SORT_FIELDS),
  userId: z.guid().optional(),
  listItemId: z.guid().optional(),
  listId: z.guid().optional(),
  itemId: z.guid().optional(),
})

export type AdminReservationsListQueryInput = z.input<typeof adminReservationsListQuerySchema>
export type AdminReservationsListQueryParsed = z.output<typeof adminReservationsListQuerySchema>

export const adminReservationsListResponseSchema = paginatedResponseSchema(
  adminReservationDetailSchema,
)

export type AdminReservationsListResponseInput = z.input<typeof adminReservationsListResponseSchema>
export type AdminReservationsListResponseParsed = z.output<
  typeof adminReservationsListResponseSchema
>

export const adminReservationsGetResponseSchema = z.object({
  reservation: adminReservationDetailSchema,
})

export type AdminReservationsGetResponseInput = z.input<typeof adminReservationsGetResponseSchema>
export type AdminReservationsGetResponseParsed = z.output<typeof adminReservationsGetResponseSchema>
