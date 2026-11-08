import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../../_shared/item-detail.js'
import {
  itemCategoryIdsSchema,
  itemDescriptionSchema,
  itemNameSchema,
} from '../../_shared/item-fields.js'
import { DUPLICATE_SHOP_IN_SOURCES_MESSAGE } from '../../_shared/messages.js'
import { tagNamesSchema } from '../../_shared/tag-fields.js'
import { adminItemsCreateSourceRequestSchema } from './item-sources.js'

interface SourceWithShopId {
  shopId: string | null
}

// Every entry sharing a non-null shopId with another one is reported. Null-shop sources are
// skipped: the DB partial unique index does not constrain them either.
function reportDuplicateSourceShopIds(
  sources: readonly SourceWithShopId[],
  context: z.RefinementCtx,
): void {
  const indicesByShopId = new Map<string, number[]>()
  sources.forEach((source, index) => {
    if (source.shopId === null) return
    indicesByShopId.set(source.shopId, [...(indicesByShopId.get(source.shopId) ?? []), index])
  })
  for (const indices of indicesByShopId.values()) {
    if (indices.length < 2) continue
    for (const index of indices) {
      context.addIssue({
        code: 'custom',
        path: ['sources', index, 'shopId'],
        message: DUPLICATE_SHOP_IN_SOURCES_MESSAGE,
      })
    }
  }
}

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file.
export const adminItemsCreateRequestSchema = z
  .strictObject({
    name: itemNameSchema,
    description: itemDescriptionSchema.optional().transform((value) => value ?? null),
    sources: z.array(adminItemsCreateSourceRequestSchema).min(1),
    categories: itemCategoryIdsSchema.optional(),
    tags: tagNamesSchema.optional(),
  })
  .superRefine((value, context) => {
    reportDuplicateSourceShopIds(value.sources, context)
  })

export type AdminItemsCreateRequestInput = z.input<typeof adminItemsCreateRequestSchema>
export type AdminItemsCreateRequestParsed = z.output<typeof adminItemsCreateRequestSchema>

export const adminItemsCreateResponseSchema = z.object({
  item: itemWithSourcesDetailSchema,
})

export type AdminItemsCreateResponseInput = z.input<typeof adminItemsCreateResponseSchema>
export type AdminItemsCreateResponseParsed = z.output<typeof adminItemsCreateResponseSchema>
