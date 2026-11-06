import { z } from 'zod'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'
import { paginatedResponseSchema } from '../../_shared/pagination.js'
import { reportDetailSchema } from '../../reports/report-detail.js'

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

export const adminReportsListResponseSchema = paginatedResponseSchema(adminReportDetailSchema)

export type AdminReportsListResponseInput = z.input<typeof adminReportsListResponseSchema>
export type AdminReportsListResponseParsed = z.output<typeof adminReportsListResponseSchema>

export const adminReportsGetResponseSchema = z.object({
  report: adminReportDetailSchema,
})

export type AdminReportsGetResponseInput = z.input<typeof adminReportsGetResponseSchema>
export type AdminReportsGetResponseParsed = z.output<typeof adminReportsGetResponseSchema>
