import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  adminUserDetailSchema,
  adminUsersListQuerySchema,
} from '../../src/schemas/admin/users/admin-user-detail.js'
import {
  adminUsersCreateRequestSchema,
  type AdminUsersCreateRequestParsed,
} from '../../src/schemas/admin/users/create-user.js'
import { adminUsersUpdateRequestSchema } from '../../src/schemas/admin/users/update-user.js'
import type { StaffRole } from '../../src/enums/user-role.js'
import { USER_STATUS_VALUES, type UserStatus } from '../../src/enums/user-status.js'
import { buildUserDetailWire } from '../fixtures.js'

describe('adminUsersCreateRequestSchema', () => {
  it.each(['moderator', 'admin'] as const)('accepts the %s staff role', (role) => {
    const parsed = adminUsersCreateRequestSchema.parse({ email: 'Staff@Example.com', role })

    expect(parsed).toEqual({ email: 'staff@example.com', username: null, role })
  })

  it('rejects the user role: regular users only come from public registration', () => {
    const result = adminUsersCreateRequestSchema.safeParse({ email: 'a@example.com', role: 'user' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual(['role'])
  })

  it('types the parsed role as a staff role', () => {
    expectTypeOf<AdminUsersCreateRequestParsed['role']>().toEqualTypeOf<StaffRole>()
  })
})

describe('adminUsersUpdateRequestSchema', () => {
  it('still accepts the user role when changing an existing account', () => {
    const parsed = adminUsersUpdateRequestSchema.parse({ role: 'user' })

    expect(parsed.role).toBe('user')
  })
})

describe('admin user status', () => {
  it('declares the statuses in precedence order', () => {
    expect(USER_STATUS_VALUES).toEqual([
      'pending_deletion',
      'banned',
      'invited',
      'unverified',
      'inactive',
      'active',
    ])
  })

  it.each(USER_STATUS_VALUES)('filters the list by the %s status', (status) => {
    expect(adminUsersListQuerySchema.parse({ status }).status).toBe(status)
  })

  it('leaves the status filter optional and rejects an unknown status', () => {
    expect(adminUsersListQuerySchema.parse({}).status).toBeUndefined()
    expect(adminUsersListQuerySchema.safeParse({ status: 'deleted' }).success).toBe(false)
  })

  it('requires the derived status and a nullable activatedAt on the admin user detail', () => {
    const wire = {
      ...buildUserDetailWire(),
      bannedAt: null,
      banReason: null,
      deletedAt: null,
      activatedAt: null,
      reservationsCount: 0,
    }

    expect(adminUserDetailSchema.safeParse(wire).success).toBe(false)
    expect(adminUserDetailSchema.parse({ ...wire, status: 'invited' }).activatedAt).toBeNull()
    expectTypeOf<
      ReturnType<typeof adminUserDetailSchema.parse>['status']
    >().toEqualTypeOf<UserStatus>()
  })
})
