import { z } from 'zod'
import { REPORT_REASON_VALUES } from '../../enums/report-reason.js'
import { REPORT_TARGET_TYPE_VALUES } from '../../enums/report-target-type.js'
import { REPORT_DESCRIPTION_MAX_LENGTH, reportDetailSchema } from './report-detail.js'

export const reportsCreateRequestSchema = z.strictObject({
  targetType: z.enum(REPORT_TARGET_TYPE_VALUES),
  targetId: z.guid(),
  reason: z.enum(REPORT_REASON_VALUES),
  description: z
    .string()
    .trim()
    .min(1)
    .max(REPORT_DESCRIPTION_MAX_LENGTH)
    .nullable()
    .optional()
    .transform((value) => value ?? null),
})

export type ReportsCreateRequestInput = z.input<typeof reportsCreateRequestSchema>
export type ReportsCreateRequestParsed = z.output<typeof reportsCreateRequestSchema>

export const reportsCreateResponseSchema = z.object({
  report: reportDetailSchema,
})

export type ReportsCreateResponseInput = z.input<typeof reportsCreateResponseSchema>
export type ReportsCreateResponseParsed = z.output<typeof reportsCreateResponseSchema>
