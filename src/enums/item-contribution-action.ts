export const ItemContributionActions = {
  FILL: 'fill',
  ADMIN_UPDATE: 'admin_update',
} as const

export type ItemContributionAction =
  (typeof ItemContributionActions)[keyof typeof ItemContributionActions]

export const ITEM_CONTRIBUTION_ACTION_VALUES = Object.values(ItemContributionActions) as [
  ItemContributionAction,
  ...ItemContributionAction[],
]
