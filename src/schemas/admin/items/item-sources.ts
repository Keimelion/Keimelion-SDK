import { z } from 'zod'
import { supportedCurrencyEnum } from '../../_shared/currency.js'
import { itemSourceDetailSchema } from '../../_shared/item-detail.js'
import { httpsUrlSchema } from '../../_shared/url.js'

const MAX_SOURCE_URL_LENGTH = 2048
const PRICE_REGEX = /^\d{1,8}(\.\d{1,2})?$/

const sourceUrlSchema = httpsUrlSchema('sourceUrl', MAX_SOURCE_URL_LENGTH).nullable()

const priceSchema = z
  .string()
  .regex(
    PRICE_REGEX,
    'price must be a decimal with up to 8 digits before the dot and 2 after (e.g. 19.99)',
  )
  .nullable()

const shopIdSchema = z.guid().nullable()

export const adminItemsCreateSourceRequestSchema = z.strictObject({
  shopId: shopIdSchema.optional().transform((value) => value ?? null),
  sourceUrl: sourceUrlSchema.optional().transform((value) => value ?? null),
  price: priceSchema.optional().transform((value) => value ?? null),
  currency: supportedCurrencyEnum.default('EUR'),
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
