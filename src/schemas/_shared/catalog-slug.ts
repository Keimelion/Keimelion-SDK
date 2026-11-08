import type { z } from 'zod'
import { createSlugSchema } from './slug.js'

const MIN_CATALOG_SLUG_LENGTH = 2
const MAX_CATALOG_SLUG_LENGTH = 60

// Slug rule shared by the admin-managed catalog resources (shops, categories).
export const catalogSlugSchema = createSlugSchema({
  min: MIN_CATALOG_SLUG_LENGTH,
  max: MAX_CATALOG_SLUG_LENGTH,
  example: 'my-shop',
})

export type CatalogSlugInput = z.input<typeof catalogSlugSchema>
export type CatalogSlugParsed = z.output<typeof catalogSlugSchema>
