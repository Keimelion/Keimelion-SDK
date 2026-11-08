import { z } from 'zod'
import { tagNameSchema } from '../../_shared/tag-fields.js'
import { tagDetailSchema } from './admin-tag-detail.js'
import { tagSlugSchema } from './tag-slug.js'

export const adminTagsCreateRequestSchema = z.strictObject({
  name: tagNameSchema,
  slug: tagSlugSchema,
})

export type AdminTagsCreateRequestInput = z.input<typeof adminTagsCreateRequestSchema>
export type AdminTagsCreateRequestParsed = z.output<typeof adminTagsCreateRequestSchema>

export const adminTagsCreateResponseSchema = z.object({
  tag: tagDetailSchema,
})

export type AdminTagsCreateResponseInput = z.input<typeof adminTagsCreateResponseSchema>
export type AdminTagsCreateResponseParsed = z.output<typeof adminTagsCreateResponseSchema>
