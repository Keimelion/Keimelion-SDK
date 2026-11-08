import { z } from 'zod'
import { REVIEWED_REPORT_STATUS_VALUES } from '../../../enums/report-status.js'
import { adminReportDetailSchema } from './admin-report-detail.js'

export const REPORT_ADMIN_NOTE_MAX_LENGTH = 2000

export const adminReportsUpdateRequestSchema = z.strictObject({
  status: z.enum(REVIEWED_REPORT_STATUS_VALUES).optional(),
  adminNote: z.string().trim().min(1).max(REPORT_ADMIN_NOTE_MAX_LENGTH).nullable().optional(),
})

export type AdminReportsUpdateRequestInput = z.input<typeof adminReportsUpdateRequestSchema>
export type AdminReportsUpdateRequestParsed = z.output<typeof adminReportsUpdateRequestSchema>

export const adminReportsUpdateResponseSchema = z.object({
  report: adminReportDetailSchema,
})

export type AdminReportsUpdateResponseInput = z.input<typeof adminReportsUpdateResponseSchema>
export type AdminReportsUpdateResponseParsed = z.output<typeof adminReportsUpdateResponseSchema>
