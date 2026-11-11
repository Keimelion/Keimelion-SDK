export const PublicPaths = {
  GET_LIST: '/v1/public/lists/:slug',
  CREATE_WAITLIST_ENTRY: '/v1/public/waitlist',
  CONFIRM_WAITLIST_ENTRY: '/v1/public/waitlist/confirm',
  UNSUBSCRIBE_WAITLIST_ENTRY: '/v1/public/waitlist/unsubscribe',
} as const
