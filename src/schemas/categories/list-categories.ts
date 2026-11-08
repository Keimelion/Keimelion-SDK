import { z } from 'zod'
import { categorySummarySchema } from '../_shared/category-summary.js'
import type { CategorySummaryInput, CategorySummaryParsed } from '../_shared/category-summary.js'

export type CategoryTreeNodeInput = CategorySummaryInput & { children: CategoryTreeNodeInput[] }
export type CategoryTreeNodeParsed = CategorySummaryParsed & { children: CategoryTreeNodeParsed[] }

// Annotated by hand: an inferred recursive schema type is elided to `any` in the emitted .d.ts.
export const categoryTreeNodeSchema: z.ZodType<CategoryTreeNodeParsed, CategoryTreeNodeInput> =
  categorySummarySchema.extend({
    get children() {
      return z.array(categoryTreeNodeSchema)
    },
  })

export const categoriesListResponseSchema = z.object({
  categories: z.array(categoryTreeNodeSchema),
})

export type CategoriesListResponseInput = z.input<typeof categoriesListResponseSchema>
export type CategoriesListResponseParsed = z.output<typeof categoriesListResponseSchema>
