import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../_shared/item-detail.js'
import {
  itemCategoryIdsSchema,
  itemDescriptionSchema,
  itemNameSchema,
} from '../_shared/item-fields.js'
import { tagNamesSchema } from '../_shared/tag-fields.js'

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file.
export const itemsUpdateRequestSchema = z.strictObject({
  name: itemNameSchema.optional(),
  description: itemDescriptionSchema.optional(),
  tags: tagNamesSchema.optional(),
  categories: itemCategoryIdsSchema.optional(),
  clearImage: z.boolean().optional(),
})

export type ItemsUpdateRequestInput = z.input<typeof itemsUpdateRequestSchema>
export type ItemsUpdateRequestParsed = z.output<typeof itemsUpdateRequestSchema>

export const itemsUpdateResponseSchema = z.object({
  item: itemWithSourcesDetailSchema,
})

export type ItemsUpdateResponseInput = z.input<typeof itemsUpdateResponseSchema>
export type ItemsUpdateResponseParsed = z.output<typeof itemsUpdateResponseSchema>
