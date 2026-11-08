import { z } from 'zod'

export const MAX_LIST_TITLE_LENGTH = 200

export const LIST_SORT_FIELDS = ['createdAt', 'updatedAt', 'title', 'listStatus'] as const

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
