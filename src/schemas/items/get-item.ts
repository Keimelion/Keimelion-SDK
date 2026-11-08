import { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../_shared/item-detail.js'

export const itemsGetResponseSchema = z.object({
  item: itemWithSourcesDetailSchema,
})

export type ItemsGetResponseInput = z.input<typeof itemsGetResponseSchema>
export type ItemsGetResponseParsed = z.output<typeof itemsGetResponseSchema>
