import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  adminUsersCreateRequestSchema,
  type AdminUsersCreateRequestParsed,
} from '../../src/schemas/admin/users/create-user.js'
import { adminUsersUpdateRequestSchema } from '../../src/schemas/admin/users/update-user.js'
import type { StaffRole } from '../../src/enums/user-role.js'

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
