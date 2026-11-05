import { z } from 'zod'

export const PAGINATION_DEFAULT_PAGE = 1
export const PAGINATION_DEFAULT_LIMIT = 20
export const PAGINATION_MAX_LIMIT = 100

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION_DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION_MAX_LIMIT).default(PAGINATION_DEFAULT_LIMIT),
})

export type PaginationQueryInput = z.input<typeof paginationQuerySchema>
export type PaginationQueryParsed = z.output<typeof paginationQuerySchema>

export const paginationMetaSchema = z.object({
  page: z.number().int(),
  limit: z.number().int(),
  total: z.number().int(),
  totalPages: z.number().int(),
})

export type PaginationMetaInput = z.input<typeof paginationMetaSchema>
export type PaginationMetaParsed = z.output<typeof paginationMetaSchema>

export interface PaginatedResponse<TItem> {
  items: TItem[]
  pagination: PaginationMetaParsed
}

type PaginatedResponseSchema<TItemSchema extends z.ZodType> = z.ZodObject<{
  items: z.ZodArray<TItemSchema>
  pagination: typeof paginationMetaSchema
}>

export function paginatedResponseSchema<TItemSchema extends z.ZodType>(
  itemSchema: TItemSchema,
): PaginatedResponseSchema<TItemSchema> {
  return z.object({
    items: z.array(itemSchema),
    pagination: paginationMetaSchema,
  })
}

export type PaginatedResponseInput<TItemSchema extends z.ZodType> = z.input<
  PaginatedResponseSchema<TItemSchema>
>
export type PaginatedResponseParsed<TItemSchema extends z.ZodType> = z.output<
  PaginatedResponseSchema<TItemSchema>
>
