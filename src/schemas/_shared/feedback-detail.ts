import { z } from 'zod'
import { FEEDBACK_STATUS_VALUES } from '../../enums/feedback-status.js'
import { isoDateTimeSchema } from './timestamp.js'

export const feedbackDetailSchema = z.object({
  id: z.guid(),
  userId: z.guid().nullable(),
  title: z.string(),
  description: z.string(),
  context: z.record(z.string(), z.unknown()).nullable(),
  status: z.enum(FEEDBACK_STATUS_VALUES),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type FeedbackDetailInput = z.input<typeof feedbackDetailSchema>
export type FeedbackDetailParsed = z.output<typeof feedbackDetailSchema>
