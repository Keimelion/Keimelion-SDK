export const UserRoles = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export const USER_ROLE_VALUES = Object.values(UserRoles) as [UserRole, ...UserRole[]]

// Staff accounts are created by an admin; regular users only come from public registration.
export const STAFF_ROLE_VALUES = [UserRoles.MODERATOR, UserRoles.ADMIN] as const

export type StaffRole = (typeof STAFF_ROLE_VALUES)[number]
