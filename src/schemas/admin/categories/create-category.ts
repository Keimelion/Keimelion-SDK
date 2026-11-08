import { z } from 'zod'
import { catalogSlugSchema } from '../../_shared/catalog-slug.js'
import { adminCategoryDetailSchema } from './admin-category-detail.js'
import { categoryNameSchema } from './category-fields.js'

export const adminCategoriesCreateRequestSchema = z.strictObject({
  name: z.strictObject({
    fr: categoryNameSchema,
    en: categoryNameSchema,
  }),
  slug: catalogSlugSchema,
  parentId: z
    .guid()
    .nullable()
    .optional()
    .transform((value) => value ?? null),
})

export type AdminCategoriesCreateRequestInput = z.input<typeof adminCategoriesCreateRequestSchema>
export type AdminCategoriesCreateRequestParsed = z.output<typeof adminCategoriesCreateRequestSchema>

export const adminCategoriesCreateResponseSchema = z.object({
  category: adminCategoryDetailSchema,
})

export type AdminCategoriesCreateResponseInput = z.input<typeof adminCategoriesCreateResponseSchema>
export type AdminCategoriesCreateResponseParsed = z.output<
  typeof adminCategoriesCreateResponseSchema
>
