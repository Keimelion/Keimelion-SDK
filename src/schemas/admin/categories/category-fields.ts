import { z } from 'zod'

export const MAX_CATEGORY_NAME_LENGTH = 120

export const categoryNameSchema = z.string().trim().min(1).max(MAX_CATEGORY_NAME_LENGTH)

export type CategoryNameInput = z.input<typeof categoryNameSchema>
export type CategoryNameParsed = z.output<typeof categoryNameSchema>
