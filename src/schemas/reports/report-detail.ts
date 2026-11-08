import { z } from 'zod'
import { REPORT_REASON_VALUES } from '../../enums/report-reason.js'
import { REPORT_STATUS_VALUES } from '../../enums/report-status.js'
import { REPORT_TARGET_TYPE_VALUES } from '../../enums/report-target-type.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'

export const REPORT_DESCRIPTION_MAX_LENGTH = 1000

export const reportDetailSchema = z.object({
  id: z.guid(),
  userId: z.guid().nullable(),
  targetType: z.enum(REPORT_TARGET_TYPE_VALUES),
  targetId: z.guid(),
  reason: z.enum(REPORT_REASON_VALUES),
  description: z.string().nullable(),
  status: z.enum(REPORT_STATUS_VALUES),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ReportDetailInput = z.input<typeof reportDetailSchema>
export type ReportDetailParsed = z.output<typeof reportDetailSchema>
