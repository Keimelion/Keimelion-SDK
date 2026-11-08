import { z } from 'zod'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'
import { userDetailSchema } from '../../_shared/user-detail.js'

export const ADMIN_USERS_SORT_FIELDS = ['createdAt', 'email', 'username', 'lastActiveAt'] as const

export const ADMIN_USERS_FILTERS = {
  id: ['eq', 'in'],
  email: ['eq', 'ilike'],
  username: ['eq', 'ilike'],
  createdAt: ['gte', 'lte', 'between'],
  bannedAt: ['isNull'],
  deletedAt: ['isNull'],
  role: ['eq', 'in'],
} as const satisfies AdminFilterConfig

export type AdminUsersListFilters = AdminFilterQuery<typeof ADMIN_USERS_FILTERS>

export const adminUserDetailSchema = userDetailSchema.extend({
  bannedAt: isoDateTimeSchema.nullable(),
  banReason: z.string().nullable(),
  deletedAt: isoDateTimeSchema.nullable(),
  reservationsCount: z.number().int(),
})

export type AdminUserDetailInput = z.input<typeof adminUserDetailSchema>
export type AdminUserDetailParsed = z.output<typeof adminUserDetailSchema>

export const adminUsersListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_USERS_SORT_FIELDS),
})

export type AdminUsersListQueryInput = z.input<typeof adminUsersListQuerySchema>
export type AdminUsersListQueryParsed = z.output<typeof adminUsersListQuerySchema>

export const adminUsersListResponseSchema = paginatedResponseSchema(adminUserDetailSchema)

export type AdminUsersListResponseInput = z.input<typeof adminUsersListResponseSchema>
export type AdminUsersListResponseParsed = z.output<typeof adminUsersListResponseSchema>

export const adminUsersGetResponseSchema = z.object({
  user: adminUserDetailSchema,
})

export type AdminUsersGetResponseInput = z.input<typeof adminUsersGetResponseSchema>
export type AdminUsersGetResponseParsed = z.output<typeof adminUsersGetResponseSchema>
