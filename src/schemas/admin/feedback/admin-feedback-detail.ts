import { z } from 'zod'
import { FEEDBACK_STATUS_VALUES } from '../../../enums/feedback-status.js'
import { feedbackDetailSchema } from '../../_shared/feedback-detail.js'
import { paginatedResponseSchema, paginationQuerySchema } from '../../_shared/pagination.js'
import { sortQuerySchema } from '../../_shared/sort.js'
import type { AdminFilterConfig, AdminFilterQuery } from '../../_shared/admin-filter.js'

export const ADMIN_FEEDBACK_SORT_FIELDS = ['createdAt', 'updatedAt', 'status'] as const

export const ADMIN_FEEDBACK_FILTERS = {
  status: ['eq', 'in'],
  userId: ['eq', 'isNull'],
  title: ['ilike'],
  createdAt: ['gte', 'lte', 'between'],
} as const satisfies AdminFilterConfig

export type AdminFeedbackListFilters = AdminFilterQuery<typeof ADMIN_FEEDBACK_FILTERS>

export const feedbackUserSummarySchema = z.object({
  id: z.guid(),
  username: z.string().nullable(),
  email: z.string(),
})

export type FeedbackUserSummaryInput = z.input<typeof feedbackUserSummarySchema>
export type FeedbackUserSummaryParsed = z.output<typeof feedbackUserSummarySchema>

export const adminFeedbackDetailSchema = feedbackDetailSchema.extend({
  user: feedbackUserSummarySchema.nullable(),
})

export type AdminFeedbackDetailInput = z.input<typeof adminFeedbackDetailSchema>
export type AdminFeedbackDetailParsed = z.output<typeof adminFeedbackDetailSchema>

export const adminFeedbackListQuerySchema = paginationQuerySchema.extend({
  sort: sortQuerySchema(ADMIN_FEEDBACK_SORT_FIELDS),
})

export type AdminFeedbackListQueryInput = z.input<typeof adminFeedbackListQuerySchema>
export type AdminFeedbackListQueryParsed = z.output<typeof adminFeedbackListQuerySchema>

export const adminFeedbackListResponseSchema = paginatedResponseSchema(adminFeedbackDetailSchema)

export type AdminFeedbackListResponseInput = z.input<typeof adminFeedbackListResponseSchema>
export type AdminFeedbackListResponseParsed = z.output<typeof adminFeedbackListResponseSchema>

export const adminFeedbackUpdateRequestSchema = z.strictObject({
  status: z.enum(FEEDBACK_STATUS_VALUES),
})

export type AdminFeedbackUpdateRequestInput = z.input<typeof adminFeedbackUpdateRequestSchema>
export type AdminFeedbackUpdateRequestParsed = z.output<typeof adminFeedbackUpdateRequestSchema>

export const adminFeedbackUpdateResponseSchema = z.object({
  feedback: adminFeedbackDetailSchema,
})

export type AdminFeedbackUpdateResponseInput = z.input<typeof adminFeedbackUpdateResponseSchema>
export type AdminFeedbackUpdateResponseParsed = z.output<typeof adminFeedbackUpdateResponseSchema>
