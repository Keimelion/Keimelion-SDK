import { z } from 'zod'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'
import { tagSummarySchema } from '../../_shared/tag-summary.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'

export const ADMIN_TAGS_SORT_FIELDS = ['name', 'slug', 'createdAt', 'updatedAt'] as const

export const ADMIN_TAGS_FILTERS = {
  name: ['eq', 'ilike'],
  slug: ['eq', 'ilike'],
  createdByUserId: ['eq', 'isNull'],
} as const satisfies AdminFilterConfig

export type AdminTagsListFilters = AdminFilterQuery<typeof ADMIN_TAGS_FILTERS>

export const tagDetailSchema = tagSummarySchema.extend({
  createdByUserId: z.guid().nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type TagDetailInput = z.input<typeof tagDetailSchema>
export type TagDetailParsed = z.output<typeof tagDetailSchema>

export const adminTagsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_TAGS_SORT_FIELDS),
})

export type AdminTagsListQueryInput = z.input<typeof adminTagsListQuerySchema>
export type AdminTagsListQueryParsed = z.output<typeof adminTagsListQuerySchema>

export const adminTagsListResponseSchema = paginatedResponseSchema(tagDetailSchema)

export type AdminTagsListResponseInput = z.input<typeof adminTagsListResponseSchema>
export type AdminTagsListResponseParsed = z.output<typeof adminTagsListResponseSchema>

export const adminTagsGetResponseSchema = z.object({
  tag: tagDetailSchema,
})

export type AdminTagsGetResponseInput = z.input<typeof adminTagsGetResponseSchema>
export type AdminTagsGetResponseParsed = z.output<typeof adminTagsGetResponseSchema>
