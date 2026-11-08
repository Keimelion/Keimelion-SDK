import type { z } from 'zod'
import { paginatedResponseSchema, paginationQuerySchema } from '../_shared/pagination.js'
import { tagNameSchema } from '../_shared/tag-fields.js'
import { tagSummarySchema } from '../_shared/tag-summary.js'

export const tagsListQuerySchema = paginationQuerySchema.extend({
  name: tagNameSchema.optional(),
})

export type TagsListQueryInput = z.input<typeof tagsListQuerySchema>
export type TagsListQueryParsed = z.output<typeof tagsListQuerySchema>

export const tagsListResponseSchema = paginatedResponseSchema(tagSummarySchema)

export type TagsListResponseInput = z.input<typeof tagsListResponseSchema>
export type TagsListResponseParsed = z.output<typeof tagsListResponseSchema>
