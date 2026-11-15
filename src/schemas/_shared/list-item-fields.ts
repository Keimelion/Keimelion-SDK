import { z } from 'zod'

export const MAX_CREATOR_NOTE_LENGTH = 1000
export const MAX_QUANTITY_DESIRED = 100
export const MAX_CUSTOM_NAME_LENGTH = 300

export const creatorNoteSchema = z
  .string()
  .trim()
  .max(MAX_CREATOR_NOTE_LENGTH)
  .nullable()
  .transform((value) => (value === '' ? null : value))

export type CreatorNoteInput = z.input<typeof creatorNoteSchema>
export type CreatorNoteParsed = z.output<typeof creatorNoteSchema>

export const quantityDesiredSchema = z.number().int().min(1).max(MAX_QUANTITY_DESIRED)

export type QuantityDesiredInput = z.input<typeof quantityDesiredSchema>
export type QuantityDesiredParsed = z.output<typeof quantityDesiredSchema>

export const customNameSchema = z
  .string()
  .trim()
  .max(
    MAX_CUSTOM_NAME_LENGTH,
    `customName must be at most ${String(MAX_CUSTOM_NAME_LENGTH)} characters`,
  )
  .nullable()
  .transform((value) => (value === '' ? null : value))

export type CustomNameInput = z.input<typeof customNameSchema>
export type CustomNameParsed = z.output<typeof customNameSchema>
