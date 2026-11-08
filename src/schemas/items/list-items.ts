import type { z } from 'zod'
import { itemWithSourcesDetailSchema } from '../_shared/item-detail.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../_shared/pagination.js'

export const itemsListQuerySchema = paginationQuerySchema

export type ItemsListQueryInput = z.input<typeof itemsListQuerySchema>
export type ItemsListQueryParsed = z.output<typeof itemsListQuerySchema>

export const itemsListResponseSchema = paginatedResponseSchema(itemWithSourcesDetailSchema)

export type ItemsListResponseInput = z.input<typeof itemsListResponseSchema>
export type ItemsListResponseParsed = z.output<typeof itemsListResponseSchema>
