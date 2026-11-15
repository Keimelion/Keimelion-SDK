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

export const GTIN_LENGTH = 14

const GTIN_INPUT_REGEX = /^(?:\d{8}|\d{12,14})$/
const GTIN_PADDING_DIGIT = '0'
const GTIN_ODD_POSITION_WEIGHT = 3
const GTIN_EVEN_POSITION_WEIGHT = 1
const DECIMAL_BASE = 10

// UPC-A (12), EAN-13 and GTIN-8 left-pad to GTIN-14 so every encoding of a product stores one value.
export const itemGtinSchema = z
  .string()
  .trim()
  .regex(GTIN_INPUT_REGEX, 'gtin must contain 8, 12, 13 or 14 digits')
  .transform((value) => value.padStart(GTIN_LENGTH, GTIN_PADDING_DIGIT))
  .refine(hasValidGtinCheckDigit, 'gtin check digit is invalid')

export type ItemGtinInput = z.input<typeof itemGtinSchema>
export type ItemGtinParsed = z.output<typeof itemGtinSchema>

// GS1 mod-10: from the left of a GTIN-14, payload digits alternate weights 3 and 1.
function hasValidGtinCheckDigit(gtin: string): boolean {
  const digits = Array.from(gtin, Number)
  const checkDigit = digits.pop()
  const weightedSum = digits.reduce(
    (sum, digit, position) =>
      sum + digit * (position % 2 === 0 ? GTIN_ODD_POSITION_WEIGHT : GTIN_EVEN_POSITION_WEIGHT),
    0,
  )
  return checkDigit === (DECIMAL_BASE - (weightedSum % DECIMAL_BASE)) % DECIMAL_BASE
}
