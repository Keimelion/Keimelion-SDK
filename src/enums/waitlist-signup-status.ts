export const WaitlistSignupStatuses = {
  SUBSCRIBED: 'subscribed',
  ALREADY_SUBSCRIBED: 'already_subscribed',
} as const

export type WaitlistSignupStatus =
  (typeof WaitlistSignupStatuses)[keyof typeof WaitlistSignupStatuses]

export const WAITLIST_SIGNUP_STATUS_VALUES = Object.values(WaitlistSignupStatuses) as [
  WaitlistSignupStatus,
  ...WaitlistSignupStatus[],
]
