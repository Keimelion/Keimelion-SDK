import { z } from 'zod'
import { catalogSlugSchema } from '../../_shared/catalog-slug.js'
import { sortOrderSchema } from '../../_shared/sort-order.js'
import { shopDetailSchema } from './admin-shop-detail.js'
import { shopDomainSchema, shopLogoUrlSchema, shopNameSchema } from './shop-fields.js'

export const adminShopsUpdateRequestSchema = z.strictObject({
  slug: catalogSlugSchema.optional(),
  name: shopNameSchema.optional(),
  domain: shopDomainSchema.optional(),
  logoUrl: shopLogoUrlSchema.optional(),
  isAffiliated: z.boolean().optional(),
  sortOrder: sortOrderSchema.optional(),
  isActive: z.boolean().optional(),
})

export type AdminShopsUpdateRequestInput = z.input<typeof adminShopsUpdateRequestSchema>
export type AdminShopsUpdateRequestParsed = z.output<typeof adminShopsUpdateRequestSchema>

export const adminShopsUpdateResponseSchema = z.object({
  shop: shopDetailSchema,
})

export type AdminShopsUpdateResponseInput = z.input<typeof adminShopsUpdateResponseSchema>
export type AdminShopsUpdateResponseParsed = z.output<typeof adminShopsUpdateResponseSchema>
