import { z } from 'zod'
import { LIST_STATUS_VALUES } from '../../enums/list-status.js'
import { collaboratorSummarySchema, listMemberSummarySchema } from './list-member.js'
import { tagSummarySchema } from './tag-summary.js'
import { isoDateTimeSchema } from './timestamp.js'

export const listDetailSchema = z.object({
  id: z.guid(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  listStatus: z.enum(LIST_STATUS_VALUES),
  occasionTypeId: z.guid().nullable(),
  owner: listMemberSummarySchema.nullable(),
  collaborators: z.array(collaboratorSummarySchema),
  tags: z.array(tagSummarySchema),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type ListDetailInput = z.input<typeof listDetailSchema>
export type ListDetailParsed = z.output<typeof listDetailSchema>
