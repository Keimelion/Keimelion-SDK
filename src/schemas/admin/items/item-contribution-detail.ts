import { z } from 'zod'
import { ITEM_CONTRIBUTION_ACTION_VALUES } from '../../../enums/item-contribution-action.js'
import { isoDateTimeSchema } from '../../_shared/timestamp.js'

export const itemContributionChangeSchema = z.object({
  from: z.string().nullable(),
  to: z.string().nullable(),
})

export type ItemContributionChangeInput = z.input<typeof itemContributionChangeSchema>
export type ItemContributionChangeParsed = z.output<typeof itemContributionChangeSchema>

// Only the fields actually changed are present. name is only changed by an admin_update.
export const itemContributionChangesSchema = z.object({
  name: itemContributionChangeSchema.optional(),
  description: itemContributionChangeSchema.optional(),
  gtin: itemContributionChangeSchema.optional(),
  imageId: itemContributionChangeSchema.optional(),
})

export type ItemContributionChangesInput = z.input<typeof itemContributionChangesSchema>
export type ItemContributionChangesParsed = z.output<typeof itemContributionChangesSchema>

export const itemContributionUserSummarySchema = z.object({
  id: z.guid(),
  username: z.string().nullable(),
})

export type ItemContributionUserSummaryInput = z.input<typeof itemContributionUserSummarySchema>
export type ItemContributionUserSummaryParsed = z.output<typeof itemContributionUserSummarySchema>

// user is null once the contributor account is hard-deleted.
export const itemContributionDetailSchema = z.object({
  id: z.guid(),
  action: z.enum(ITEM_CONTRIBUTION_ACTION_VALUES),
  changes: itemContributionChangesSchema,
  user: itemContributionUserSummarySchema.nullable(),
  createdAt: isoDateTimeSchema,
})

export type ItemContributionDetailInput = z.input<typeof itemContributionDetailSchema>
export type ItemContributionDetailParsed = z.output<typeof itemContributionDetailSchema>
