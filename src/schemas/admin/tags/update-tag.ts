import { z } from 'zod'
import { tagNameSchema } from '../../_shared/tag-fields.js'
import { tagDetailSchema } from './admin-tag-detail.js'
import { tagSlugSchema } from './tag-slug.js'

export const adminTagsUpdateRequestSchema = z.strictObject({
  name: tagNameSchema.optional(),
  slug: tagSlugSchema.optional(),
})

export type AdminTagsUpdateRequestInput = z.input<typeof adminTagsUpdateRequestSchema>
export type AdminTagsUpdateRequestParsed = z.output<typeof adminTagsUpdateRequestSchema>

export const adminTagsUpdateResponseSchema = z.object({
  tag: tagDetailSchema,
})

export type AdminTagsUpdateResponseInput = z.input<typeof adminTagsUpdateResponseSchema>
export type AdminTagsUpdateResponseParsed = z.output<typeof adminTagsUpdateResponseSchema>
