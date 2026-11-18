import { z } from 'zod'
import { supportedCurrencyEnum } from '../_shared/currency.js'
import { itemDetailSchema, itemSourceDetailSchema } from '../_shared/item-detail.js'
import {
  itemCategoryIdsSchema,
  itemDescriptionSchema,
  itemGtinSchema,
  itemNameSchema,
} from '../_shared/item-fields.js'
import {
  DEFAULT_SOURCE_CURRENCY,
  itemSourcePriceSchema,
  itemSourceUrlSchema,
} from '../_shared/item-source-fields.js'
import { listItemDetailSchema } from '../_shared/list-item-detail.js'
import {
  creatorNoteSchema,
  customNameSchema,
  customUrlSchema,
  quantityDesiredSchema,
} from '../_shared/list-item-fields.js'
import { ADD_ITEM_TARGET_MESSAGE } from '../_shared/messages.js'
import { tagNamesSchema } from '../_shared/tag-fields.js'

const listItemShape = {
  quantityDesired: quantityDesiredSchema.optional(),
  creatorNote: creatorNoteSchema.optional(),
  customName: customNameSchema.optional(),
  customUrl: customUrlSchema.optional(),
}

// A sourceUrl sent with an itemId only becomes a new source of that item when the API can attach it;
// otherwise it is kept as the personal customUrl of the list item (unless customUrl is explicit).
export const listsAddItemByIdRequestSchema = z.strictObject({
  itemId: z.guid(),
  sourceUrl: itemSourceUrlSchema.optional(),
  ...listItemShape,
})

export type ListsAddItemByIdRequestInput = z.input<typeof listsAddItemByIdRequestSchema>
export type ListsAddItemByIdRequestParsed = z.output<typeof listsAddItemByIdRequestSchema>

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file.
export const listsAddProductRequestSchema = z.strictObject({
  name: itemNameSchema,
  description: itemDescriptionSchema.optional(),
  tags: tagNamesSchema.optional(),
  categories: itemCategoryIdsSchema.optional(),
  sourceUrl: itemSourceUrlSchema.optional(),
  gtin: itemGtinSchema.optional(),
  price: itemSourcePriceSchema.optional(),
  currency: supportedCurrencyEnum.default(DEFAULT_SOURCE_CURRENCY),
  ...listItemShape,
})

export type ListsAddProductRequestInput = z.input<typeof listsAddProductRequestSchema>
export type ListsAddProductRequestParsed = z.output<typeof listsAddProductRequestSchema>

export const listsAddItemRequestSchema = z.union(
  [listsAddItemByIdRequestSchema, listsAddProductRequestSchema],
  { error: ADD_ITEM_TARGET_MESSAGE },
)

export type ListsAddItemRequestInput = z.input<typeof listsAddItemRequestSchema>
export type ListsAddItemRequestParsed = z.output<typeof listsAddItemRequestSchema>

export const listsAddItemResponseSchema = z.object({
  listItem: listItemDetailSchema.extend({
    item: itemDetailSchema,
    source: itemSourceDetailSchema.nullable(),
  }),
})

export type ListsAddItemResponseInput = z.input<typeof listsAddItemResponseSchema>
export type ListsAddItemResponseParsed = z.output<typeof listsAddItemResponseSchema>

// Metadata of a LIST_ITEM_ALREADY_EXISTS error: the client can offer to update the quantity instead.
export const listItemAlreadyExistsMetadataSchema = z.object({
  listItemId: z.guid(),
  quantityDesired: z.number().int(),
})

export type ListItemAlreadyExistsMetadataInput = z.input<typeof listItemAlreadyExistsMetadataSchema>
export type ListItemAlreadyExistsMetadataParsed = z.output<
  typeof listItemAlreadyExistsMetadataSchema
>
