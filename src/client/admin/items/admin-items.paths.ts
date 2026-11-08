export const AdminItemsPaths = {
  LIST: '/v1/admin/items',
  CREATE: '/v1/admin/items',
  GET: '/v1/admin/items/:id',
  UPDATE: '/v1/admin/items/:id',
  DELETE: '/v1/admin/items/:id',
  CREATE_SOURCE: '/v1/admin/items/:id/sources',
  UPDATE_SOURCE: '/v1/admin/items/:id/sources/:sourceId',
  DELETE_SOURCE: '/v1/admin/items/:id/sources/:sourceId',
} as const
