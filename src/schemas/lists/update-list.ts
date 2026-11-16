import { z } from 'zod'
import { listDetailSchema } from '../_shared/list-detail.js'
import {
  listDescriptionSchema,
  listOccasionTypeIdSchema,
  listTitleSchema,
} from '../_shared/list-fields.js'
import { tagNamesSchema } from '../_shared/tag-fields.js'

export const listsUpdateRequestSchema = z.strictObject({
  title: listTitleSchema.optional(),
  description: listDescriptionSchema.optional(),
  occasionTypeId: listOccasionTypeIdSchema.optional(),
  tags: tagNamesSchema.optional(),
})

export type ListsUpdateRequestInput = z.input<typeof listsUpdateRequestSchema>
export type ListsUpdateRequestParsed = z.output<typeof listsUpdateRequestSchema>

export const listsUpdateResponseSchema = z.object({
  list: listDetailSchema,
})

export type ListsUpdateResponseInput = z.input<typeof listsUpdateResponseSchema>
export type ListsUpdateResponseParsed = z.output<typeof listsUpdateResponseSchema>
