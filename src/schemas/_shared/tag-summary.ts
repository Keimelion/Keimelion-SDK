import { z } from 'zod'

export const tagSummarySchema = z.object({
  id: z.guid(),
  name: z.string(),
  slug: z.string(),
})

export type TagSummaryInput = z.input<typeof tagSummarySchema>
export type TagSummaryParsed = z.output<typeof tagSummarySchema>
