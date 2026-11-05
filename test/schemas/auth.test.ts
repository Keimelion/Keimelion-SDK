import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  loginRequestSchema,
  loginResponseSchema,
  type LoginRequestInput,
  type LoginRequestParsed,
  type LoginResponseInput,
  type LoginResponseParsed,
} from '../../src/schemas/auth/login.js'
import { logoutRequestSchema } from '../../src/schemas/auth/logout.js'
import { refreshRequestSchema } from '../../src/schemas/auth/refresh.js'
import {
  registerRequestSchema,
  type RegisterRequestInput,
  type RegisterRequestParsed,
} from '../../src/schemas/auth/register.js'
import { resetPasswordRequestSchema } from '../../src/schemas/auth/reset-password.js'
import { verifyEmailRequestSchema } from '../../src/schemas/auth/verify-email.js'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../../src/schemas/shared/password.js'
import { buildImageDetailWire, buildUserDetailWire, UPDATED_AT_ISO } from '../fixtures.js'

describe('loginRequestSchema', () => {
  it('normalises the email to lowercase', () => {
    const parsed = loginRequestSchema.parse({ email: 'Jane@Example.COM', password: 'secret' })

    expect(parsed.email).toBe('jane@example.com')
  })

  it('rejects an empty password and an invalid email', () => {
    const result = loginRequestSchema.safeParse({ email: 'nope', password: '' })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual(['email', 'password'])
  })
})

describe('loginResponseSchema', () => {
  it('decodes the user timestamps into Dates', () => {
    const parsed = loginResponseSchema.parse({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: buildUserDetailWire(),
    })

    expect(parsed.user.createdAt).toBeInstanceOf(Date)
    expect(parsed.user.updatedAt.toISOString()).toBe(UPDATED_AT_ISO)
    expect(parsed.user.lastActiveAt).toBeNull()
  })

  it('decodes a nested avatar image', () => {
    const parsed = loginResponseSchema.parse({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { ...buildUserDetailWire(), avatar: buildImageDetailWire() },
    })

    expect(parsed.user.avatar?.createdAt).toBeInstanceOf(Date)
  })

  it('strips unknown keys so additive API fields stay non-breaking', () => {
    const parsed = loginResponseSchema.parse({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { ...buildUserDetailWire(), futureField: 'x' },
      futureTopLevel: true,
    })

    expect(parsed).not.toHaveProperty('futureTopLevel')
    expect(parsed.user).not.toHaveProperty('futureField')
  })

  it('rejects a user with an invalid timestamp', () => {
    const result = loginResponseSchema.safeParse({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: { ...buildUserDetailWire(), createdAt: 'yesterday' },
    })

    expect(result.success).toBe(false)
  })

  it('exposes wire strings as input and Dates as output', () => {
    expectTypeOf<LoginResponseInput['user']['createdAt']>().toEqualTypeOf<string>()
    expectTypeOf<LoginResponseParsed['user']['createdAt']>().toEqualTypeOf<Date>()
    expectTypeOf<LoginRequestInput>().toEqualTypeOf<LoginRequestParsed>()
  })
})

describe('registerRequestSchema', () => {
  it('applies defaults for optional fields', () => {
    const parsed = registerRequestSchema.parse({ email: 'jane@example.com', password: 'password1' })

    expect(parsed.username).toBeNull()
    expect(parsed.isMarketingOptedIn).toBe(false)
  })

  it('separates the optional input type from the defaulted parsed type', () => {
    expectTypeOf<RegisterRequestInput['isMarketingOptedIn']>().toEqualTypeOf<boolean | undefined>()
    expectTypeOf<RegisterRequestParsed['isMarketingOptedIn']>().toEqualTypeOf<boolean>()
    expectTypeOf<RegisterRequestParsed['username']>().toEqualTypeOf<string | null>()
  })

  it('rejects an unsupported currency', () => {
    const result = registerRequestSchema.safeParse({
      email: 'jane@example.com',
      password: 'password1',
      defaultCurrency: 'XYZ',
    })

    expect(result.success).toBe(false)
  })
})

describe('auth request schemas', () => {
  it('requires a non-empty refresh token on refresh', () => {
    expect(refreshRequestSchema.safeParse({ refreshToken: '' }).success).toBe(false)
    expect(refreshRequestSchema.safeParse({ refreshToken: 'abc' }).success).toBe(true)
  })

  it('accepts logout with or without a refresh token', () => {
    expect(logoutRequestSchema.safeParse({}).success).toBe(true)
    expect(logoutRequestSchema.safeParse({ refreshToken: 'abc' }).success).toBe(true)
    expect(logoutRequestSchema.safeParse({ refreshToken: '' }).success).toBe(false)
  })

  it('bounds the reset password length', () => {
    const tooShort = 'a'.repeat(MIN_PASSWORD_LENGTH - 1)
    const tooLong = 'a'.repeat(MAX_PASSWORD_LENGTH + 1)

    expect(
      resetPasswordRequestSchema.safeParse({ passwordResetToken: 't', password: tooShort }).success,
    ).toBe(false)
    expect(
      resetPasswordRequestSchema.safeParse({ passwordResetToken: 't', password: tooLong }).success,
    ).toBe(false)
  })

  it('requires a GUID token on verify-email', () => {
    expect(verifyEmailRequestSchema.safeParse({ token: 'abc' }).success).toBe(false)
  })
})
