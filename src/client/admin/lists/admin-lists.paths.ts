export const AdminListsPaths = {
  LIST: '/v1/admin/lists',
  GET: '/v1/admin/lists/:id',
  UPDATE: '/v1/admin/lists/:id',
  DELETE: '/v1/admin/lists/:id',
  RESTORE: '/v1/admin/lists/:id/restore',
  LIST_ITEMS: '/v1/admin/lists/:id/items',
} as const
