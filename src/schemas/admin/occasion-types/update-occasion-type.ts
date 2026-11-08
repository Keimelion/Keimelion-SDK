import { z } from 'zod'
import { DEFAULT_LOCALE } from '../../../enums/locale.js'
import { sortOrderSchema } from '../../_shared/sort-order.js'
import { adminOccasionTypeDetailSchema } from './admin-occasion-type-detail.js'
import {
  hasUniqueLocales,
  occasionTypeEmojiSchema,
  occasionTypeLabelSchema,
  occasionTypeLocaleSchema,
} from './occasion-type-fields.js'

export const adminOccasionTypesUpdateRequestSchema = z.strictObject({
  emoji: occasionTypeEmojiSchema.nullable().optional(),
  sortOrder: sortOrderSchema.optional(),
  isActive: z.boolean().optional(),
  translations: z
    .array(
      z.object({ locale: occasionTypeLocaleSchema, label: occasionTypeLabelSchema.nullable() }),
    )
    .refine(hasUniqueLocales, 'Duplicate locale in translations')
    .refine(
      (entries) =>
        !entries.some(
          (translation) => translation.locale === DEFAULT_LOCALE && translation.label === null,
        ),
      `Cannot remove the default locale (${DEFAULT_LOCALE}) translation`,
    )
    .optional(),
})

export type AdminOccasionTypesUpdateRequestInput = z.input<
  typeof adminOccasionTypesUpdateRequestSchema
>
export type AdminOccasionTypesUpdateRequestParsed = z.output<
  typeof adminOccasionTypesUpdateRequestSchema
>

export const adminOccasionTypesUpdateResponseSchema = z.object({
  occasionType: adminOccasionTypeDetailSchema,
})

export type AdminOccasionTypesUpdateResponseInput = z.input<
  typeof adminOccasionTypesUpdateResponseSchema
>
export type AdminOccasionTypesUpdateResponseParsed = z.output<
  typeof adminOccasionTypesUpdateResponseSchema
>
