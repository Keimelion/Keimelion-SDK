import { z } from 'zod'
import { DEFAULT_LOCALE } from '../../../enums/locale.js'
import { createSlugSchema } from '../../_shared/slug.js'
import { sortOrderSchema } from '../../_shared/sort-order.js'
import { adminOccasionTypeDetailSchema } from './admin-occasion-type-detail.js'
import {
  hasUniqueLocales,
  occasionTypeEmojiSchema,
  occasionTypeLabelSchema,
  occasionTypeLocaleSchema,
} from './occasion-type-fields.js'

const MIN_SLUG_LENGTH = 2
const MAX_SLUG_LENGTH = 60

export const adminOccasionTypesCreateRequestSchema = z.strictObject({
  slug: createSlugSchema({ min: MIN_SLUG_LENGTH, max: MAX_SLUG_LENGTH, example: 'my-slug' }),
  emoji: occasionTypeEmojiSchema.nullish().transform((value) => value ?? null),
  sortOrder: sortOrderSchema.default(0),
  isActive: z.boolean().default(true),
  translations: z
    .array(z.object({ locale: occasionTypeLocaleSchema, label: occasionTypeLabelSchema }))
    .min(1)
    .refine(hasUniqueLocales, 'Duplicate locale in translations')
    .refine(
      (entries) => entries.some((translation) => translation.locale === DEFAULT_LOCALE),
      `Translation for default locale (${DEFAULT_LOCALE}) is required`,
    ),
})

export type AdminOccasionTypesCreateRequestInput = z.input<
  typeof adminOccasionTypesCreateRequestSchema
>
export type AdminOccasionTypesCreateRequestParsed = z.output<
  typeof adminOccasionTypesCreateRequestSchema
>

export const adminOccasionTypesCreateResponseSchema = z.object({
  occasionType: adminOccasionTypeDetailSchema,
})

export type AdminOccasionTypesCreateResponseInput = z.input<
  typeof adminOccasionTypesCreateResponseSchema
>
export type AdminOccasionTypesCreateResponseParsed = z.output<
  typeof adminOccasionTypesCreateResponseSchema
>
