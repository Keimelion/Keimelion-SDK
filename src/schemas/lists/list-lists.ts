import type { z } from 'zod'
import { listDetailSchema } from '../_shared/list-detail.js'
import { LIST_SORT_FIELDS } from '../_shared/list-fields.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../_shared/pagination.js'
import { sortQuerySchema } from '../_shared/sort.js'

export const listsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(LIST_SORT_FIELDS),
})

export type ListsListQueryInput = z.input<typeof listsListQuerySchema>
export type ListsListQueryParsed = z.output<typeof listsListQuerySchema>

export const listsListResponseSchema = paginatedResponseSchema(listDetailSchema)

export type ListsListResponseInput = z.input<typeof listsListResponseSchema>
export type ListsListResponseParsed = z.output<typeof listsListResponseSchema>
