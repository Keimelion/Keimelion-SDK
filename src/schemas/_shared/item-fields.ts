import { z } from 'zod'

export const MAX_ITEM_NAME_LENGTH = 300
export const MAX_ITEM_DESCRIPTION_LENGTH = 5000
export const MAX_CATEGORIES_PER_ITEM = 2

export const itemNameSchema = z.string().trim().min(1).max(MAX_ITEM_NAME_LENGTH)

export type ItemNameInput = z.input<typeof itemNameSchema>
export type ItemNameParsed = z.output<typeof itemNameSchema>

export const itemDescriptionSchema = z
  .string()
  .trim()
  .max(MAX_ITEM_DESCRIPTION_LENGTH)
  .nullable()
  .transform((value) => (value === '' ? null : value))

export type ItemDescriptionInput = z.input<typeof itemDescriptionSchema>
export type ItemDescriptionParsed = z.output<typeof itemDescriptionSchema>

export const itemCategoryIdsSchema = z
  .array(z.guid())
  .max(
    MAX_CATEGORIES_PER_ITEM,
    `categories must contain at most ${String(MAX_CATEGORIES_PER_ITEM)} entries`,
  )

export type ItemCategoryIdsInput = z.input<typeof itemCategoryIdsSchema>
export type ItemCategoryIdsParsed = z.output<typeof itemCategoryIdsSchema>
