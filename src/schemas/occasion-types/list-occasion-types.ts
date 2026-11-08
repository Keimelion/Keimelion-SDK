import { z } from 'zod'

export const occasionTypeSummarySchema = z.object({
  id: z.guid(),
  slug: z.string(),
  label: z.string(),
  emoji: z.string().nullable(),
})

export type OccasionTypeSummaryInput = z.input<typeof occasionTypeSummarySchema>
export type OccasionTypeSummaryParsed = z.output<typeof occasionTypeSummarySchema>

export const occasionTypesListResponseSchema = z.array(occasionTypeSummarySchema)

export type OccasionTypesListResponseInput = z.input<typeof occasionTypesListResponseSchema>
export type OccasionTypesListResponseParsed = z.output<typeof occasionTypesListResponseSchema>
