import { z } from 'zod'
import { supportedCurrencyEnum } from '../../_shared/currency.js'
import { itemSourceDetailSchema } from '../../_shared/item-detail.js'
import {
  DEFAULT_SOURCE_CURRENCY,
  itemSourcePriceSchema,
  itemSourceUrlSchema,
} from '../../_shared/item-source-fields.js'

const sourceUrlSchema = itemSourceUrlSchema.nullable()
const priceSchema = itemSourcePriceSchema.nullable()

const shopIdSchema = z.guid().nullable()

export const adminItemsCreateSourceRequestSchema = z.strictObject({
  shopId: shopIdSchema.optional().transform((value) => value ?? null),
  sourceUrl: sourceUrlSchema.optional().transform((value) => value ?? null),
  price: priceSchema.optional().transform((value) => value ?? null),
  currency: supportedCurrencyEnum.default(DEFAULT_SOURCE_CURRENCY),
})

export type AdminItemsCreateSourceRequestInput = z.input<typeof adminItemsCreateSourceRequestSchema>
export type AdminItemsCreateSourceRequestParsed = z.output<
  typeof adminItemsCreateSourceRequestSchema
>

export const adminItemsCreateSourceResponseSchema = z.object({
  source: itemSourceDetailSchema,
})

export type AdminItemsCreateSourceResponseInput = z.input<
  typeof adminItemsCreateSourceResponseSchema
>
export type AdminItemsCreateSourceResponseParsed = z.output<
  typeof adminItemsCreateSourceResponseSchema
>

export const adminItemsUpdateSourceRequestSchema = z.strictObject({
  shopId: shopIdSchema.optional(),
  sourceUrl: sourceUrlSchema.optional(),
  price: priceSchema.optional(),
  currency: supportedCurrencyEnum.optional(),
})

export type AdminItemsUpdateSourceRequestInput = z.input<typeof adminItemsUpdateSourceRequestSchema>
export type AdminItemsUpdateSourceRequestParsed = z.output<
  typeof adminItemsUpdateSourceRequestSchema
>

export const adminItemsUpdateSourceResponseSchema = z.object({
  source: itemSourceDetailSchema,
})

export type AdminItemsUpdateSourceResponseInput = z.input<
  typeof adminItemsUpdateSourceResponseSchema
>
export type AdminItemsUpdateSourceResponseParsed = z.output<
  typeof adminItemsUpdateSourceResponseSchema
>
