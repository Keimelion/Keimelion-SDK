import { z } from 'zod'

export const USER_EXPORT_FORMATS = ['json', 'csv'] as const

export const usersExportQuerySchema = z.object({
  format: z.enum(USER_EXPORT_FORMATS).default('json'),
})

export type UsersExportQueryInput = z.input<typeof usersExportQuerySchema>
export type UsersExportQueryParsed = z.output<typeof usersExportQuerySchema>
