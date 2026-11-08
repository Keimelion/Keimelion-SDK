import { z } from 'zod'
import { categorySummarySchema } from '../_shared/category-summary.js'

export const categoryTreeNodeSchema = categorySummarySchema.extend({
  get children() {
    return z.array(categoryTreeNodeSchema)
  },
})

export type CategoryTreeNodeInput = z.input<typeof categoryTreeNodeSchema>
export type CategoryTreeNodeParsed = z.output<typeof categoryTreeNodeSchema>

export const categoriesListResponseSchema = z.object({
  categories: z.array(categoryTreeNodeSchema),
})

export type CategoriesListResponseInput = z.input<typeof categoriesListResponseSchema>
export type CategoriesListResponseParsed = z.output<typeof categoriesListResponseSchema>
