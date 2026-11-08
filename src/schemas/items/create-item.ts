import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../_shared/item-detail.js'
import {
  itemCategoryIdsSchema,
  itemDescriptionSchema,
  itemNameSchema,
} from '../_shared/item-fields.js'
import { tagNamesSchema } from '../_shared/tag-fields.js'

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file.
export const itemsCreateRequestSchema = z.strictObject({
  name: itemNameSchema,
  description: itemDescriptionSchema.optional(),
  tags: tagNamesSchema.optional(),
  categories: itemCategoryIdsSchema.optional(),
})

export type ItemsCreateRequestInput = z.input<typeof itemsCreateRequestSchema>
export type ItemsCreateRequestParsed = z.output<typeof itemsCreateRequestSchema>

export const itemsCreateResponseSchema = z.object({
  item: itemWithSourcesDetailSchema,
})

export type ItemsCreateResponseInput = z.input<typeof itemsCreateResponseSchema>
export type ItemsCreateResponseParsed = z.output<typeof itemsCreateResponseSchema>
