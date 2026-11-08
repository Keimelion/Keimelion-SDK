import { z } from 'zod'
import { displayCurrencyQuerySchema, supportedCurrencyEnum } from '../../_shared/currency.js'
import { listDetailSchema } from '../../_shared/list-detail.js'
import { LIST_SORT_FIELDS } from '../../_shared/list-fields.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'
import { userDetailSchema } from '../../_shared/user-detail.js'

export const ADMIN_LISTS_FILTERS = {
  id: ['eq', 'in'],
  title: ['eq', 'ilike'],
  listStatus: ['eq', 'in'],
  occasionTypeId: ['eq', 'isNull'],
  createdAt: ['gte', 'lte', 'between'],
  updatedAt: ['gte', 'lte', 'between'],
  deletedAt: ['isNull'],
} as const satisfies AdminFilterConfig

export type AdminListsListFilters = AdminFilterQuery<typeof ADMIN_LISTS_FILTERS>

export const adminListDetailSchema = listDetailSchema
  .omit({ owner: true, collaborators: true })
  .extend({
    owner: userDetailSchema.nullable(),
    deletedAt: isoDateTimeSchema.nullable(),
    itemCount: z.number().int(),
    totalEstimatedPrice: z.string().nullable(),
    displayCurrency: supportedCurrencyEnum,
  })

export type AdminListDetailInput = z.input<typeof adminListDetailSchema>
export type AdminListDetailParsed = z.output<typeof adminListDetailSchema>

export const adminListsListQuerySchema = paginationQuerySchema
  .extend(displayCurrencyQuerySchema.shape)
  .extend({
    sort: sortQuerySchema(LIST_SORT_FIELDS),
    ownerUserId: z.guid().optional(),
  })

export type AdminListsListQueryInput = z.input<typeof adminListsListQuerySchema>
export type AdminListsListQueryParsed = z.output<typeof adminListsListQuerySchema>

export const adminListsListResponseSchema = paginatedResponseSchema(adminListDetailSchema)

export type AdminListsListResponseInput = z.input<typeof adminListsListResponseSchema>
export type AdminListsListResponseParsed = z.output<typeof adminListsListResponseSchema>

export const adminListsGetQuerySchema = displayCurrencyQuerySchema

export type AdminListsGetQueryInput = z.input<typeof adminListsGetQuerySchema>
export type AdminListsGetQueryParsed = z.output<typeof adminListsGetQuerySchema>

export const adminListsGetResponseSchema = z.object({
  list: adminListDetailSchema,
})

export type AdminListsGetResponseInput = z.input<typeof adminListsGetResponseSchema>
export type AdminListsGetResponseParsed = z.output<typeof adminListsGetResponseSchema>

export const adminListsRestoreResponseSchema = z.object({
  list: adminListDetailSchema,
})

export type AdminListsRestoreResponseInput = z.input<typeof adminListsRestoreResponseSchema>
export type AdminListsRestoreResponseParsed = z.output<typeof adminListsRestoreResponseSchema>
