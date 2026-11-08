import { z } from 'zod'
import { itemDetailSchema } from './item-detail.js'
import { isoDateTimeSchema } from './timestamp.js'
import { userDetailSchema } from './user-detail.js'

export const RESERVATION_SORT_FIELDS = ['createdAt', 'quantityBooked'] as const

export const reservationListItemSummarySchema = z.object({
  id: z.guid(),
  quantityDesired: z.number().int(),
  item: itemDetailSchema,
})

export type ReservationListItemSummaryInput = z.input<typeof reservationListItemSummarySchema>
export type ReservationListItemSummaryParsed = z.output<typeof reservationListItemSummarySchema>

export const reservationListSummarySchema = z.object({
  id: z.guid(),
  slug: z.string(),
  title: z.string(),
  owner: userDetailSchema.nullable(),
})

export type ReservationListSummaryInput = z.input<typeof reservationListSummarySchema>
export type ReservationListSummaryParsed = z.output<typeof reservationListSummarySchema>

export const reservationDetailSchema = z.object({
  id: z.guid(),
  reserverName: z.string().nullable(),
  reserverEmail: z.string().nullable(),
  quantityBooked: z.number().int(),
  createdAt: isoDateTimeSchema,
  listItem: reservationListItemSummarySchema,
  list: reservationListSummarySchema,
})

export type ReservationDetailInput = z.input<typeof reservationDetailSchema>
export type ReservationDetailParsed = z.output<typeof reservationDetailSchema>
