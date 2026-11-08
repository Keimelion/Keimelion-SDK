import { z } from 'zod'
import { itemDetailSchema, itemSourceDetailSchema } from '../_shared/item-detail.js'
import { listItemDetailSchema } from '../_shared/list-item-detail.js'
import { creatorNoteSchema, quantityDesiredSchema } from '../_shared/list-item-fields.js'

export const listsAddItemRequestSchema = z.strictObject({
  itemId: z.guid(),
  quantityDesired: quantityDesiredSchema.optional(),
  creatorNote: creatorNoteSchema.optional(),
})

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
