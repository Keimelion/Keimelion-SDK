import { z } from 'zod'
import { ITEM_STATUS_VALUES } from '../../enums/item-status.js'
import { LIST_STATUS_VALUES } from '../../enums/list-status.js'
import { categorySummarySchema } from '../_shared/category-summary.js'
import { imageDetailSchema } from '../_shared/image-detail.js'
import { itemSourceDetailSchema } from '../_shared/item-detail.js'
import { tagSummarySchema } from '../_shared/tag-summary.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'

export const publicUserSummarySchema = z.object({
  id: z.guid(),
  username: z.string().nullable(),
  avatar: imageDetailSchema.nullable(),
})

export type PublicUserSummaryInput = z.input<typeof publicUserSummarySchema>
export type PublicUserSummaryParsed = z.output<typeof publicUserSummarySchema>

export const publicItemDetailSchema = z.object({
  id: z.guid(),
  name: z.string(),
  description: z.string().nullable(),
  imageId: z.guid().nullable(),
  image: imageDetailSchema.nullable(),
  sources: z.array(itemSourceDetailSchema),
  categories: z.array(categorySummarySchema),
  tags: z.array(tagSummarySchema),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type PublicItemDetailInput = z.input<typeof publicItemDetailSchema>
export type PublicItemDetailParsed = z.output<typeof publicItemDetailSchema>

export const publicListItemDetailSchema = z.object({
  id: z.guid(),
  listId: z.guid(),
  itemId: z.guid(),
  quantityDesired: z.number().int(),
  quantityReservedTotal: z.number().int(),
  itemStatus: z.enum(ITEM_STATUS_VALUES),
  sortOrder: z.number().int().nullable(),
  creatorNote: z.string().nullable(),
  item: publicItemDetailSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type PublicListItemDetailInput = z.input<typeof publicListItemDetailSchema>
export type PublicListItemDetailParsed = z.output<typeof publicListItemDetailSchema>

export const publicListDetailSchema = z.object({
  id: z.guid(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  listStatus: z.enum(LIST_STATUS_VALUES),
  occasionTypeId: z.guid().nullable(),
  owner: publicUserSummarySchema.nullable(),
  tags: z.array(tagSummarySchema),
  items: z.array(publicListItemDetailSchema),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type PublicListDetailInput = z.input<typeof publicListDetailSchema>
export type PublicListDetailParsed = z.output<typeof publicListDetailSchema>

export const publicListsGetResponseSchema = z.object({
  list: publicListDetailSchema,
})

export type PublicListsGetResponseInput = z.input<typeof publicListsGetResponseSchema>
export type PublicListsGetResponseParsed = z.output<typeof publicListsGetResponseSchema>
