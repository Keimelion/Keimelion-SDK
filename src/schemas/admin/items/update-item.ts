import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../../_shared/item-detail.js'
import {
  itemCategoryIdsSchema,
  itemDescriptionSchema,
  itemNameSchema,
} from '../../_shared/item-fields.js'
import { tagNamesSchema } from '../../_shared/tag-fields.js'

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file.
export const adminItemsUpdateRequestSchema = z.strictObject({
  name: itemNameSchema.optional(),
  description: itemDescriptionSchema.optional(),
  categories: itemCategoryIdsSchema.optional(),
  tags: tagNamesSchema.optional(),
  clearImage: z.boolean().optional(),
})

export type AdminItemsUpdateRequestInput = z.input<typeof adminItemsUpdateRequestSchema>
export type AdminItemsUpdateRequestParsed = z.output<typeof adminItemsUpdateRequestSchema>

export const adminItemsUpdateResponseSchema = z.object({
  item: itemWithSourcesDetailSchema,
})

export type AdminItemsUpdateResponseInput = z.input<typeof adminItemsUpdateResponseSchema>
export type AdminItemsUpdateResponseParsed = z.output<typeof adminItemsUpdateResponseSchema>
