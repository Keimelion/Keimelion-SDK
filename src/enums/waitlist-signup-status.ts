// Every signup answers with the same status, so the response never reveals whether an address
// is already on the waitlist.
export const WaitlistSignupStatuses = {
  PENDING_CONFIRMATION: 'pending_confirmation',
} as const

export type WaitlistSignupStatus =
  (typeof WaitlistSignupStatuses)[keyof typeof WaitlistSignupStatuses]

export const WAITLIST_SIGNUP_STATUS_VALUES = Object.values(WaitlistSignupStatuses) as [
  WaitlistSignupStatus,
  ...WaitlistSignupStatus[],
]
