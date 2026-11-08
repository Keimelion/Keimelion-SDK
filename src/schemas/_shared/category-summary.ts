import { z } from 'zod'

export const categorySummarySchema = z.object({
  id: z.guid(),
  parentId: z.guid().nullable(),
  name: z.string(),
  slug: z.string(),
  depth: z.number().int(),
})

export type CategorySummaryInput = z.input<typeof categorySummarySchema>
export type CategorySummaryParsed = z.output<typeof categorySummarySchema>
