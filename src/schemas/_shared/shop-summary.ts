import { z } from 'zod'

export const shopSummarySchema = z.object({
  id: z.guid(),
  slug: z.string(),
  name: z.string(),
  domain: z.string().nullable(),
  logoUrl: z.string().nullable(),
  isAffiliated: z.boolean(),
})

export type ShopSummaryInput = z.input<typeof shopSummarySchema>
export type ShopSummaryParsed = z.output<typeof shopSummarySchema>
