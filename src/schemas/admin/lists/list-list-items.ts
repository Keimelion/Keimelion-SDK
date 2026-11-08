import { z } from 'zod'
import { displayCurrencyQuerySchema, supportedCurrencyEnum } from '../../_shared/currency.js'
import { itemSourceDetailSchema, itemWithSourcesDetailSchema } from '../../_shared/item-detail.js'
import { listItemDetailSchema } from '../../_shared/list-item-detail.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'

export const adminListItemDetailSchema = listItemDetailSchema.extend({
  item: itemWithSourcesDetailSchema,
  sources: z.array(itemSourceDetailSchema),
  averagePrice: z.string().nullable(),
  displayCurrency: supportedCurrencyEnum,
})

export type AdminListItemDetailInput = z.input<typeof adminListItemDetailSchema>
export type AdminListItemDetailParsed = z.output<typeof adminListItemDetailSchema>

export const adminListsListItemsQuerySchema = paginationQuerySchema.extend(
  displayCurrencyQuerySchema.shape,
)

export type AdminListsListItemsQueryInput = z.input<typeof adminListsListItemsQuerySchema>
export type AdminListsListItemsQueryParsed = z.output<typeof adminListsListItemsQuerySchema>

export const adminListsListItemsResponseSchema = paginatedResponseSchema(adminListItemDetailSchema)

export type AdminListsListItemsResponseInput = z.input<typeof adminListsListItemsResponseSchema>
export type AdminListsListItemsResponseParsed = z.output<typeof adminListsListItemsResponseSchema>
