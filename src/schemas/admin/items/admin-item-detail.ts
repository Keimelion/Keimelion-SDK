import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../../_shared/item-detail.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'

export const ADMIN_ITEMS_SORT_FIELDS = ['name', 'createdAt', 'updatedAt'] as const

export const ADMIN_ITEMS_FILTERS = {
  id: ['eq', 'in'],
  name: ['eq', 'ilike'],
  createdByUserId: ['eq', 'isNull'],
  createdAt: ['gte', 'lte', 'between'],
} as const satisfies AdminFilterConfig

export type AdminItemsListFilters = AdminFilterQuery<typeof ADMIN_ITEMS_FILTERS>

export const adminItemDetailSchema = itemWithSourcesDetailSchema.extend({
  reservationCount: z.number().int(),
})

export type AdminItemDetailInput = z.input<typeof adminItemDetailSchema>
export type AdminItemDetailParsed = z.output<typeof adminItemDetailSchema>

export const adminItemsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_ITEMS_SORT_FIELDS),
})

export type AdminItemsListQueryInput = z.input<typeof adminItemsListQuerySchema>
export type AdminItemsListQueryParsed = z.output<typeof adminItemsListQuerySchema>

export const adminItemsListResponseSchema = paginatedResponseSchema(adminItemDetailSchema)

export type AdminItemsListResponseInput = z.input<typeof adminItemsListResponseSchema>
export type AdminItemsListResponseParsed = z.output<typeof adminItemsListResponseSchema>

export const adminItemsGetResponseSchema = z.object({
  item: adminItemDetailSchema,
})

export type AdminItemsGetResponseInput = z.input<typeof adminItemsGetResponseSchema>
export type AdminItemsGetResponseParsed = z.output<typeof adminItemsGetResponseSchema>
