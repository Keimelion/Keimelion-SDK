import { z } from 'zod'
import { ITEM_STATUS_VALUES } from '../../enums/item-status.js'
import { isoDateTimeSchema } from './timestamp.js'

export const listItemDetailSchema = z.object({
  id: z.guid(),
  listId: z.guid(),
  itemId: z.guid(),
  quantityDesired: z.number().int(),
  quantityReservedTotal: z.number().int(),
  itemStatus: z.enum(ITEM_STATUS_VALUES),
  sortOrder: z.number().int().nullable(),
  creatorNote: z.string().nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ListItemDetailInput = z.input<typeof listItemDetailSchema>
export type ListItemDetailParsed = z.output<typeof listItemDetailSchema>
