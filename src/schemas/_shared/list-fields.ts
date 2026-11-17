import { z } from 'zod'
import { isoDateSchema } from './timestamp.js'

export const MAX_LIST_TITLE_LENGTH = 200

export const MIN_LIST_EVENT_DATE = '2000-01-01'
export const MAX_LIST_EVENT_DATE = '2100-12-31'

export const LIST_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'title',
  'listStatus',
  'eventDate',
] as const

export const listTitleSchema = z.string().trim().min(1).max(MAX_LIST_TITLE_LENGTH)

export type ListTitleInput = z.input<typeof listTitleSchema>
export type ListTitleParsed = z.output<typeof listTitleSchema>

export const listDescriptionSchema = z
  .string()
  .trim()
  .nullable()
  .transform((value) => (value === '' ? null : value))

export type ListDescriptionInput = z.input<typeof listDescriptionSchema>
export type ListDescriptionParsed = z.output<typeof listDescriptionSchema>

export const listOccasionTypeIdSchema = z.guid().nullable()

export type ListOccasionTypeIdInput = z.input<typeof listOccasionTypeIdSchema>
export type ListOccasionTypeIdParsed = z.output<typeof listOccasionTypeIdSchema>

export const listEventDateSchema = isoDateSchema
  .refine((value) => value >= MIN_LIST_EVENT_DATE, {
    message: `eventDate must be on or after ${MIN_LIST_EVENT_DATE}`,
  })
  .refine((value) => value <= MAX_LIST_EVENT_DATE, {
    message: `eventDate must be on or before ${MAX_LIST_EVENT_DATE}`,
  })
  .nullable()

export type ListEventDateInput = z.input<typeof listEventDateSchema>
export type ListEventDateParsed = z.output<typeof listEventDateSchema>
