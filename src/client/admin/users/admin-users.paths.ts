export const AdminUsersPaths = {
  LIST: '/v1/admin/users',
  CREATE: '/v1/admin/users',
  GET: '/v1/admin/users/:id',
  UPDATE: '/v1/admin/users/:id',
  DELETE: '/v1/admin/users/:id',
  RESEND_INVITATION: '/v1/admin/users/:id/resend-invitation',
} as const
