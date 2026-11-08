import { z } from 'zod'
import { LOCALES } from '../../../enums/locale.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'

export const adminCategoryDetailSchema = z.object({
  id: z.guid(),
  parentId: z.guid().nullable(),
  slug: z.string(),
  depth: z.number().int(),
  translations: z.partialRecord(z.enum(LOCALES), z.string()),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type AdminCategoryDetailInput = z.input<typeof adminCategoryDetailSchema>
export type AdminCategoryDetailParsed = z.output<typeof adminCategoryDetailSchema>

export const adminCategoriesListResponseSchema = z.object({
  items: z.array(adminCategoryDetailSchema),
})

export type AdminCategoriesListResponseInput = z.input<typeof adminCategoriesListResponseSchema>
export type AdminCategoriesListResponseParsed = z.output<typeof adminCategoriesListResponseSchema>

export const adminCategoriesGetResponseSchema = z.object({
  category: adminCategoryDetailSchema,
})

export type AdminCategoriesGetResponseInput = z.input<typeof adminCategoriesGetResponseSchema>
export type AdminCategoriesGetResponseParsed = z.output<typeof adminCategoriesGetResponseSchema>
