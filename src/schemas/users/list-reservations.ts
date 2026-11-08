import { z } from 'zod'
import { imageDetailSchema } from '../_shared/image-detail.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../_shared/pagination.js'
import { RESERVATION_SORT_FIELDS } from '../_shared/reservation-detail.js'
import { sortQuerySchema } from '../_shared/sort.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'

export const usersListReservationsQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(RESERVATION_SORT_FIELDS),
})

export type UsersListReservationsQueryInput = z.input<typeof usersListReservationsQuerySchema>
export type UsersListReservationsQueryParsed = z.output<typeof usersListReservationsQuerySchema>

export const userReservationSummarySchema = z.object({
  reservation: z.object({
    id: z.guid(),
    quantityBooked: z.number().int(),
    createdAt: isoDateTimeSchema,
  }),
  listItem: z.object({
    id: z.guid(),
    name: z.string(),
    quantityDesired: z.number().int(),
    imageId: z.guid().nullable(),
    image: imageDetailSchema.nullable(),
  }),
  list: z.object({
    id: z.guid(),
    slug: z.string(),
    title: z.string(),
    ownerDisplayName: z.string().nullable(),
  }),
})

export type UserReservationSummaryInput = z.input<typeof userReservationSummarySchema>
export type UserReservationSummaryParsed = z.output<typeof userReservationSummarySchema>

export const usersListReservationsResponseSchema = paginatedResponseSchema(
  userReservationSummarySchema,
)

export type UsersListReservationsResponseInput = z.input<typeof usersListReservationsResponseSchema>
export type UsersListReservationsResponseParsed = z.output<
  typeof usersListReservationsResponseSchema
>
