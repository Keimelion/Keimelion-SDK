import { z } from 'zod'
import { listDetailSchema } from '../_shared/list-detail.js'

export const listsGetResponseSchema = z.object({
  list: listDetailSchema,
})

export type ListsGetResponseInput = z.input<typeof listsGetResponseSchema>
export type ListsGetResponseParsed = z.output<typeof listsGetResponseSchema>
