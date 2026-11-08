import type { z } from 'zod'
import { MAX_TAG_SLUG_LENGTH } from '../../_shared/tag-fields.js'
import { createSlugSchema } from '../../_shared/slug.js'

const MIN_TAG_SLUG_LENGTH = 1

export const tagSlugSchema = createSlugSchema({
  min: MIN_TAG_SLUG_LENGTH,
  max: MAX_TAG_SLUG_LENGTH,
  example: 'gaming',
})

export type TagSlugInput = z.input<typeof tagSlugSchema>
export type TagSlugParsed = z.output<typeof tagSlugSchema>
