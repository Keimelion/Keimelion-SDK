// Stored on the account and kept in sync by the API from its timestamps. Declared in precedence
// order: an account matching several statuses holds the first one.
export const UserStatuses = {
  PENDING_DELETION: 'pending_deletion',
  BANNED: 'banned',
  INVITED: 'invited',
  UNVERIFIED: 'unverified',
  INACTIVE: 'inactive',
  ACTIVE: 'active',
} as const

export type UserStatus = (typeof UserStatuses)[keyof typeof UserStatuses]

export const USER_STATUS_VALUES = Object.values(UserStatuses) as [UserStatus, ...UserStatus[]]
