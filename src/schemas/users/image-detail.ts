import { z } from 'zod'
import { isoDateTimeSchema } from '../shared/timestamp.js'

export const imageUrlsSchema = z.object({
  sm: z.url(),
  md: z.url(),
  lg: z.url(),
})

export type ImageUrlsInput = z.input<typeof imageUrlsSchema>
export type ImageUrlsParsed = z.output<typeof imageUrlsSchema>

export const imageDetailSchema = z.object({
  id: z.guid(),
  hash: z.string(),
  mime: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  createdAt: isoDateTimeSchema,
  urls: imageUrlsSchema,
})

export type ImageDetailInput = z.input<typeof imageDetailSchema>
export type ImageDetailParsed = z.output<typeof imageDetailSchema>
