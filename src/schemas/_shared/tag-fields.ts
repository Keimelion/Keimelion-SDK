import { z } from 'zod'

export const MAX_TAG_NAME_LENGTH = 50
export const MAX_TAG_SLUG_LENGTH = 50
export const MAX_TAGS_PER_RESOURCE = 20

const MIN_TAG_NAME_LENGTH = 1

export const tagNameSchema = z.string().trim().min(MIN_TAG_NAME_LENGTH).max(MAX_TAG_NAME_LENGTH)

export type TagNameInput = z.input<typeof tagNameSchema>
export type TagNameParsed = z.output<typeof tagNameSchema>

export const tagNamesSchema = z
  .array(tagNameSchema)
  .max(MAX_TAGS_PER_RESOURCE, `tags must contain at most ${String(MAX_TAGS_PER_RESOURCE)} entries`)

export type TagNamesInput = z.input<typeof tagNamesSchema>
export type TagNamesParsed = z.output<typeof tagNamesSchema>
