import { z } from 'zod'
import { catalogSlugSchema } from '../../_shared/catalog-slug.js'
import { adminCategoryDetailSchema } from './admin-category-detail.js'
import { categoryNameSchema } from './category-fields.js'

export const adminCategoriesUpdateRequestSchema = z.strictObject({
  name: z
    .strictObject({
      fr: categoryNameSchema.optional(),
      en: categoryNameSchema.optional(),
    })
    .refine(
      (value) => value.fr !== undefined || value.en !== undefined,
      'At least one translation must be provided',
    )
    .optional(),
  slug: catalogSlugSchema.optional(),
  parentId: z.guid().nullable().optional(),
})

export type AdminCategoriesUpdateRequestInput = z.input<typeof adminCategoriesUpdateRequestSchema>
export type AdminCategoriesUpdateRequestParsed = z.output<typeof adminCategoriesUpdateRequestSchema>

export const adminCategoriesUpdateResponseSchema = z.object({
  category: adminCategoryDetailSchema,
})

export type AdminCategoriesUpdateResponseInput = z.input<typeof adminCategoriesUpdateResponseSchema>
export type AdminCategoriesUpdateResponseParsed = z.output<
  typeof adminCategoriesUpdateResponseSchema
>
