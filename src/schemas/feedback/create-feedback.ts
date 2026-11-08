import { z } from 'zod'
import { feedbackDetailSchema } from '../_shared/feedback-detail.js'

export const MAX_FEEDBACK_TITLE_LENGTH = 200
export const MAX_FEEDBACK_DESCRIPTION_LENGTH = 10_000
export const MAX_FEEDBACK_CONTEXT_BYTES = 16 * 1024

function serializedByteLength(value: Record<string, unknown>): number {
  return new TextEncoder().encode(JSON.stringify(value)).length
}

const feedbackContextSchema = z
  .record(z.string(), z.unknown())
  .refine((value) => serializedByteLength(value) <= MAX_FEEDBACK_CONTEXT_BYTES, {
    message: `Context must not exceed ${String(MAX_FEEDBACK_CONTEXT_BYTES)} bytes when serialized`,
  })

export const feedbackCreateRequestSchema = z.strictObject({
  title: z.string().trim().min(1).max(MAX_FEEDBACK_TITLE_LENGTH),
  description: z.string().trim().min(1).max(MAX_FEEDBACK_DESCRIPTION_LENGTH),
  context: feedbackContextSchema.nullable().optional(),
})

export type FeedbackCreateRequestInput = z.input<typeof feedbackCreateRequestSchema>
export type FeedbackCreateRequestParsed = z.output<typeof feedbackCreateRequestSchema>

export const feedbackCreateResponseSchema = z.object({
  feedback: feedbackDetailSchema,
})

export type FeedbackCreateResponseInput = z.input<typeof feedbackCreateResponseSchema>
export type FeedbackCreateResponseParsed = z.output<typeof feedbackCreateResponseSchema>
