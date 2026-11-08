import { z } from 'zod'
import { listItemDetailSchema } from '../_shared/list-item-detail.js'
import { creatorNoteSchema, quantityDesiredSchema } from '../_shared/list-item-fields.js'

export const listItemsUpdateRequestSchema = z.strictObject({
  quantityDesired: quantityDesiredSchema.optional(),
  creatorNote: creatorNoteSchema.optional(),
  sortOrder: z.number().int().optional(),
})

export type ListItemsUpdateRequestInput = z.input<typeof listItemsUpdateRequestSchema>
export type ListItemsUpdateRequestParsed = z.output<typeof listItemsUpdateRequestSchema>

export const listItemsUpdateResponseSchema = z.object({
  listItem: listItemDetailSchema,
})

export type ListItemsUpdateResponseInput = z.input<typeof listItemsUpdateResponseSchema>
export type ListItemsUpdateResponseParsed = z.output<typeof listItemsUpdateResponseSchema>
