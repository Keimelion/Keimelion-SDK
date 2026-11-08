import { z } from 'zod'
import { categorySummarySchema } from './category-summary.js'
import { imageDetailSchema } from './image-detail.js'
import { shopSummarySchema } from './shop-summary.js'
import { tagSummarySchema } from './tag-summary.js'
import { isoDateTimeSchema } from './timestamp.js'

export const itemDetailSchema = z.object({
  id: z.guid(),
  name: z.string(),
  description: z.string().nullable(),
  imageId: z.guid().nullable(),
  image: imageDetailSchema.nullable(),
  createdByUserId: z.guid().nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ItemDetailInput = z.input<typeof itemDetailSchema>
export type ItemDetailParsed = z.output<typeof itemDetailSchema>

export const itemSourceDetailSchema = z.object({
  id: z.guid(),
  itemId: z.guid(),
  shopId: z.guid().nullable(),
  shop: shopSummarySchema.nullable(),
  sourceUrl: z.string().nullable(),
  price: z.string().nullable(),
  currency: z.string(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ItemSourceDetailInput = z.input<typeof itemSourceDetailSchema>
export type ItemSourceDetailParsed = z.output<typeof itemSourceDetailSchema>

export const itemWithSourcesDetailSchema = itemDetailSchema.extend({
  sources: z.array(itemSourceDetailSchema),
  categories: z.array(categorySummarySchema),
  tags: z.array(tagSummarySchema),
})

export type ItemWithSourcesDetailInput = z.input<typeof itemWithSourcesDetailSchema>
export type ItemWithSourcesDetailParsed = z.output<typeof itemWithSourcesDetailSchema>
