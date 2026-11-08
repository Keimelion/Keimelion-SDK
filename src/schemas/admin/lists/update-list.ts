import { z } from 'zod'
import { LIST_STATUS_VALUES } from '../../../enums/list-status.js'
import {
  listDescriptionSchema,
  listOccasionTypeIdSchema,
  listTitleSchema,
} from '../../_shared/list-fields.js'
import { tagNamesSchema } from '../../_shared/tag-fields.js'
import { adminListDetailSchema } from './admin-list-detail.js'

export const adminListsUpdateRequestSchema = z.strictObject({
  title: listTitleSchema.optional(),
  description: listDescriptionSchema.optional(),
  occasionTypeId: listOccasionTypeIdSchema.optional(),
  listStatus: z.enum(LIST_STATUS_VALUES).optional(),
  tags: tagNamesSchema.optional(),
})

export type AdminListsUpdateRequestInput = z.input<typeof adminListsUpdateRequestSchema>
export type AdminListsUpdateRequestParsed = z.output<typeof adminListsUpdateRequestSchema>

export const adminListsUpdateResponseSchema = z.object({
  list: adminListDetailSchema,
})

export type AdminListsUpdateResponseInput = z.input<typeof adminListsUpdateResponseSchema>
export type AdminListsUpdateResponseParsed = z.output<typeof adminListsUpdateResponseSchema>
