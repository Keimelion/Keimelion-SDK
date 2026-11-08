import { z } from 'zod'
import { ITEM_STATUS_VALUES } from '../../enums/item-status.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'

export const RESERVER_NAME_MAX_LENGTH = 100
export const RESERVER_EMAIL_MAX_LENGTH = 254

const RESERVER_EMAIL_REQUIRES_NAME_MESSAGE = 'reserverEmail requires reserverName'

export const reservationsCreateRequestSchema = z
  .strictObject({
    listItemId: z.guid(),
    quantityBooked: z.number().int().min(1),
    reserverName: z
      .string()
      .trim()
      .min(1)
      .max(
        RESERVER_NAME_MAX_LENGTH,
        `reserverName must be at most ${String(RESERVER_NAME_MAX_LENGTH)} characters`,
      )
      .nullish()
      .transform((value) => value ?? null),
    reserverEmail: z
      .email()
      .max(
        RESERVER_EMAIL_MAX_LENGTH,
        `reserverEmail must be at most ${String(RESERVER_EMAIL_MAX_LENGTH)} characters`,
      )
      .toLowerCase()
      .nullish()
      .transform((value) => value ?? null),
  })
  .refine((body) => body.reserverEmail === null || body.reserverName !== null, {
    message: RESERVER_EMAIL_REQUIRES_NAME_MESSAGE,
    path: ['reserverEmail'],
  })

export type ReservationsCreateRequestInput = z.input<typeof reservationsCreateRequestSchema>
export type ReservationsCreateRequestParsed = z.output<typeof reservationsCreateRequestSchema>

export const reservationSummarySchema = z.object({
  id: z.guid(),
  listItemId: z.guid(),
  userId: z.guid().nullable(),
  reserverName: z.string().nullable(),
  reserverEmail: z.string().nullable(),
  quantityBooked: z.number().int(),
  createdAt: isoDateTimeSchema,
})

export type ReservationSummaryInput = z.input<typeof reservationSummarySchema>
export type ReservationSummaryParsed = z.output<typeof reservationSummarySchema>

export const listItemReservationSummarySchema = z.object({
  id: z.guid(),
  quantityReservedTotal: z.number().int(),
  itemStatus: z.enum(ITEM_STATUS_VALUES),
})

export type ListItemReservationSummaryInput = z.input<typeof listItemReservationSummarySchema>
export type ListItemReservationSummaryParsed = z.output<typeof listItemReservationSummarySchema>

// `token` (`rsv_…`) is only returned for an anonymous reservation.
export const reservationsCreateResponseSchema = z.object({
  reservation: reservationSummarySchema,
  listItem: listItemReservationSummarySchema,
  token: z.string().optional(),
})

export type ReservationsCreateResponseInput = z.input<typeof reservationsCreateResponseSchema>
export type ReservationsCreateResponseParsed = z.output<typeof reservationsCreateResponseSchema>
