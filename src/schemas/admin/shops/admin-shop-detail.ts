import { z } from 'zod'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { shopSummarySchema } from '../../_shared/shop-summary.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'

export const ADMIN_SHOPS_SORT_FIELDS = [
  'name',
  'slug',
  'sortOrder',
  'createdAt',
  'updatedAt',
] as const

export const ADMIN_SHOPS_FILTERS = {
  name: ['eq', 'ilike'],
  slug: ['eq', 'ilike'],
  domain: ['eq', 'ilike', 'isNull'],
  isActive: ['eq'],
  isAffiliated: ['eq'],
} as const satisfies AdminFilterConfig

export type AdminShopsListFilters = AdminFilterQuery<typeof ADMIN_SHOPS_FILTERS>

export const shopDetailSchema = shopSummarySchema.extend({
  sortOrder: z.number().int(),
  isActive: z.boolean(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ShopDetailInput = z.input<typeof shopDetailSchema>
export type ShopDetailParsed = z.output<typeof shopDetailSchema>

export const adminShopItemSourceSummarySchema = z.object({
  id: z.guid(),
  itemId: z.guid(),
  itemName: z.string(),
  sourceUrl: z.string().nullable(),
  price: z.string().nullable(),
  currency: z.string(),
  createdAt: isoDateTimeSchema,
})

export type AdminShopItemSourceSummaryInput = z.input<typeof adminShopItemSourceSummarySchema>
export type AdminShopItemSourceSummaryParsed = z.output<typeof adminShopItemSourceSummarySchema>

export const adminShopsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_SHOPS_SORT_FIELDS),
})

export type AdminShopsListQueryInput = z.input<typeof adminShopsListQuerySchema>
export type AdminShopsListQueryParsed = z.output<typeof adminShopsListQuerySchema>

export const adminShopsListResponseSchema = paginatedResponseSchema(shopDetailSchema)

export type AdminShopsListResponseInput = z.input<typeof adminShopsListResponseSchema>
export type AdminShopsListResponseParsed = z.output<typeof adminShopsListResponseSchema>

export const adminShopsGetQuerySchema = paginationQuerySchema

export type AdminShopsGetQueryInput = z.input<typeof adminShopsGetQuerySchema>
export type AdminShopsGetQueryParsed = z.output<typeof adminShopsGetQuerySchema>

export const adminShopsGetResponseSchema = z.object({
  shop: shopDetailSchema,
  items: z.array(adminShopItemSourceSummarySchema),
  itemsCount: z.number().int(),
})

export type AdminShopsGetResponseInput = z.input<typeof adminShopsGetResponseSchema>
export type AdminShopsGetResponseParsed = z.output<typeof adminShopsGetResponseSchema>
