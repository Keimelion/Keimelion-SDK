import { z } from 'zod'
import { LOCALES } from '../../../enums/locale.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'

export const adminOccasionTypeTranslationSchema = z.object({
  locale: z.enum(LOCALES),
  label: z.string(),
})

export type AdminOccasionTypeTranslationInput = z.input<typeof adminOccasionTypeTranslationSchema>
export type AdminOccasionTypeTranslationParsed = z.output<typeof adminOccasionTypeTranslationSchema>

export const adminOccasionTypeDetailSchema = z.object({
  id: z.guid(),
  slug: z.string(),
  emoji: z.string().nullable(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
  translations: z.array(adminOccasionTypeTranslationSchema),
})

export type AdminOccasionTypeDetailInput = z.input<typeof adminOccasionTypeDetailSchema>
export type AdminOccasionTypeDetailParsed = z.output<typeof adminOccasionTypeDetailSchema>

export const adminOccasionTypesListQuerySchema = paginationQuerySchema

export type AdminOccasionTypesListQueryInput = z.input<typeof adminOccasionTypesListQuerySchema>
export type AdminOccasionTypesListQueryParsed = z.output<typeof adminOccasionTypesListQuerySchema>

export const adminOccasionTypesListResponseSchema = paginatedResponseSchema(
  adminOccasionTypeDetailSchema,
)

export type AdminOccasionTypesListResponseInput = z.input<
  typeof adminOccasionTypesListResponseSchema
>
export type AdminOccasionTypesListResponseParsed = z.output<
  typeof adminOccasionTypesListResponseSchema
>
