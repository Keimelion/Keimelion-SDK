import { z } from 'zod'
import { catalogSlugSchema } from '../../_shared/catalog-slug.js'
import { sortOrderSchema } from '../../_shared/sort-order.js'
import { shopDetailSchema } from './admin-shop-detail.js'
import { shopDomainSchema, shopLogoUrlSchema, shopNameSchema } from './shop-fields.js'

export const adminShopsCreateRequestSchema = z.strictObject({
  slug: catalogSlugSchema,
  name: shopNameSchema,
  domain: shopDomainSchema.optional().transform((value) => value ?? null),
  logoUrl: shopLogoUrlSchema.optional().transform((value) => value ?? null),
  isAffiliated: z.boolean().default(false),
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().default(true),
})

export type AdminShopsCreateRequestInput = z.input<typeof adminShopsCreateRequestSchema>
export type AdminShopsCreateRequestParsed = z.output<typeof adminShopsCreateRequestSchema>

export const adminShopsCreateResponseSchema = z.object({
  shop: shopDetailSchema,
})

export type AdminShopsCreateResponseInput = z.input<typeof adminShopsCreateResponseSchema>
export type AdminShopsCreateResponseParsed = z.output<typeof adminShopsCreateResponseSchema>
