import { z } from 'zod'
import { LOCALES } from '../../../enums/locale.js'

const MIN_EMOJI_LENGTH = 1
const MAX_EMOJI_LENGTH = 10
const MIN_LABEL_LENGTH = 1
const MAX_LABEL_LENGTH = 100

export const occasionTypeEmojiSchema = z.string().trim().min(MIN_EMOJI_LENGTH).max(MAX_EMOJI_LENGTH)

export type OccasionTypeEmojiInput = z.input<typeof occasionTypeEmojiSchema>
export type OccasionTypeEmojiParsed = z.output<typeof occasionTypeEmojiSchema>

export const occasionTypeLabelSchema = z.string().trim().min(MIN_LABEL_LENGTH).max(MAX_LABEL_LENGTH)

export type OccasionTypeLabelInput = z.input<typeof occasionTypeLabelSchema>
export type OccasionTypeLabelParsed = z.output<typeof occasionTypeLabelSchema>

export const occasionTypeLocaleSchema = z.enum(LOCALES)

export type OccasionTypeLocaleInput = z.input<typeof occasionTypeLocaleSchema>
export type OccasionTypeLocaleParsed = z.output<typeof occasionTypeLocaleSchema>

export function hasUniqueLocales(entries: readonly { locale: string }[]): boolean {
  return new Set(entries.map((entry) => entry.locale)).size === entries.length
}
