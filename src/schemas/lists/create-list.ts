import { z } from 'zod'
import { listDetailSchema } from '../_shared/list-detail.js'
import {
  listDescriptionSchema,
  listOccasionTypeIdSchema,
  listTitleSchema,
} from '../_shared/list-fields.js'
import { tagNamesSchema } from '../_shared/tag-fields.js'

export const listsCreateRequestSchema = z.strictObject({
  title: listTitleSchema,
  description: listDescriptionSchema.optional(),
  occasionTypeId: listOccasionTypeIdSchema.optional(),
  tags: tagNamesSchema.optional(),
})

export type ListsCreateRequestInput = z.input<typeof listsCreateRequestSchema>
export type ListsCreateRequestParsed = z.output<typeof listsCreateRequestSchema>

export const listsCreateResponseSchema = z.object({
  list: listDetailSchema,
})

export type ListsCreateResponseInput = z.input<typeof listsCreateResponseSchema>
export type ListsCreateResponseParsed = z.output<typeof listsCreateResponseSchema>
