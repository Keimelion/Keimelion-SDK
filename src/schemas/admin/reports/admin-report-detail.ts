import { z } from 'zod'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import { reportDetailSchema } from '../../reports/report-detail.js'

export const ADMIN_REPORTS_SORT_FIELDS = ['createdAt', 'updatedAt', 'status'] as const

export const ADMIN_REPORTS_FILTERS = {
  status: ['eq', 'in'],
  targetType: ['eq', 'in'],
  targetId: ['eq'],
  reason: ['eq', 'in'],
  userId: ['eq', 'isNull'],
  createdAt: ['gte', 'lte', 'between'],
} as const satisfies AdminFilterConfig

export type AdminReportsListFilters = AdminFilterQuery<typeof ADMIN_REPORTS_FILTERS>

export const reportReporterSummarySchema = z.object({
  id: z.guid(),
  username: z.string().nullable(),
})

export type ReportReporterSummaryInput = z.input<typeof reportReporterSummarySchema>
export type ReportReporterSummaryParsed = z.output<typeof reportReporterSummarySchema>

export const adminReportDetailSchema = reportDetailSchema.extend({
  reporter: reportReporterSummarySchema.nullable(),
  targetSnapshot: z.record(z.string(), z.unknown()),
  targetImageId: z.guid().nullable(),
  adminNote: z.string().nullable(),
  reviewedByUserId: z.guid().nullable(),
  reviewedAt: isoDateTimeSchema.nullable(),
})

export type AdminReportDetailInput = z.input<typeof adminReportDetailSchema>
export type AdminReportDetailParsed = z.output<typeof adminReportDetailSchema>

export const adminReportsListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_REPORTS_SORT_FIELDS),
})

export type AdminReportsListQueryInput = z.input<typeof adminReportsListQuerySchema>
export type AdminReportsListQueryParsed = z.output<typeof adminReportsListQuerySchema>

export const adminReportsListResponseSchema = paginatedResponseSchema(adminReportDetailSchema)

export type AdminReportsListResponseInput = z.input<typeof adminReportsListResponseSchema>
export type AdminReportsListResponseParsed = z.output<typeof adminReportsListResponseSchema>

export const adminReportsGetResponseSchema = z.object({
  report: adminReportDetailSchema,
})

export type AdminReportsGetResponseInput = z.input<typeof adminReportsGetResponseSchema>
export type AdminReportsGetResponseParsed = z.output<typeof adminReportsGetResponseSchema>
