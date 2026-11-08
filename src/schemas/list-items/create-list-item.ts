import { z } from 'zod'
import { listItemDetailSchema } from '../_shared/list-item-detail.js'
import { creatorNoteSchema, quantityDesiredSchema } from '../_shared/list-item-fields.js'

export const listItemsCreateRequestSchema = z.strictObject({
  listId: z.guid(),
  itemId: z.guid(),
  quantityDesired: quantityDesiredSchema.optional(),
  creatorNote: creatorNoteSchema.optional(),
})

export type ListItemsCreateRequestInput = z.input<typeof listItemsCreateRequestSchema>
export type ListItemsCreateRequestParsed = z.output<typeof listItemsCreateRequestSchema>

export const listItemsCreateResponseSchema = z.object({
  listItem: listItemDetailSchema,
})

export type ListItemsCreateResponseInput = z.input<typeof listItemsCreateResponseSchema>
export type ListItemsCreateResponseParsed = z.output<typeof listItemsCreateResponseSchema>
