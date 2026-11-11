import { describe, expect, it } from 'vitest'
import { waitlistConfirmRequestSchema } from '../../src/schemas/public/confirm-waitlist-entry.js'
import {
  MAX_WAITLIST_EMAIL_LENGTH,
  MAX_WAITLIST_HONEYPOT_LENGTH,
  waitlistCreateRequestSchema,
  waitlistCreateResponseSchema,
} from '../../src/schemas/public/create-waitlist-entry.js'
import { waitlistUnsubscribeRequestSchema } from '../../src/schemas/public/unsubscribe-waitlist-entry.js'
import { WAITLIST_TOKEN_LENGTH } from '../../src/schemas/public/waitlist-token.js'

const VALID_REQUEST = { email: 'visitor@example.com', locale: 'fr', consent: true }
const EMAIL_DOMAIN = '@example.com'
const VALID_TOKEN = 'Ab-_'.repeat(10).concat('xyz')

function issuePathsOf(input: unknown): string[] {
  const result = waitlistCreateRequestSchema.safeParse(input)
  if (result.success) return []
  return result.error.issues.map((issue) => issue.path.join('.'))
}

describe('waitlistCreateRequestSchema', () => {
  it('trims and lowercases the email', () => {
    const parsed = waitlistCreateRequestSchema.parse({
      ...VALID_REQUEST,
      email: '  Visitor@Example.COM ',
    })

    expect(parsed.email).toBe('visitor@example.com')
  })

  it('accepts an email of exactly the maximum length', () => {
    const email = `${'a'.repeat(MAX_WAITLIST_EMAIL_LENGTH - EMAIL_DOMAIN.length)}${EMAIL_DOMAIN}`

    expect(waitlistCreateRequestSchema.safeParse({ ...VALID_REQUEST, email }).success).toBe(true)
  })

  it.each([
    ['malformed', 'not-an-email'],
    ['over the maximum length', `${'a'.repeat(MAX_WAITLIST_EMAIL_LENGTH)}${EMAIL_DOMAIN}`],
  ])('reports an %s email on the email path', (_label, email) => {
    expect(issuePathsOf({ ...VALID_REQUEST, email })).toEqual(['email'])
  })

  it.each([
    ['missing', undefined],
    ['false', false],
  ])('reports a %s consent on the consent path', (_label, consent) => {
    expect(issuePathsOf({ ...VALID_REQUEST, consent })).toEqual(['consent'])
  })

  it('rejects an unsupported locale', () => {
    expect(issuePathsOf({ ...VALID_REQUEST, locale: 'de' })).toEqual(['locale'])
  })

  it('reduces a whitespace-only honeypot to an empty string', () => {
    expect(waitlistCreateRequestSchema.parse({ ...VALID_REQUEST, honeypot: '   ' }).honeypot).toBe(
      '',
    )
  })

  it('bounds the honeypot length', () => {
    const honeypot = 'x'.repeat(MAX_WAITLIST_HONEYPOT_LENGTH + 1)

    expect(issuePathsOf({ ...VALID_REQUEST, honeypot })).toEqual(['honeypot'])
  })
})

describe('waitlistCreateResponseSchema', () => {
  it('accepts the uniform pending_confirmation status', () => {
    expect(waitlistCreateResponseSchema.parse({ status: 'pending_confirmation' })).toEqual({
      status: 'pending_confirmation',
    })
  })

  it.each(['subscribed', 'already_subscribed'])('rejects the removed %s status', (status) => {
    expect(waitlistCreateResponseSchema.safeParse({ status }).success).toBe(false)
  })
})

describe.each([
  ['waitlistConfirmRequestSchema', waitlistConfirmRequestSchema],
  ['waitlistUnsubscribeRequestSchema', waitlistUnsubscribeRequestSchema],
])('%s', (_name, schema) => {
  it('accepts a base64url token of the expected length', () => {
    expect(VALID_TOKEN).toHaveLength(WAITLIST_TOKEN_LENGTH)
    expect(schema.parse({ token: VALID_TOKEN })).toEqual({ token: VALID_TOKEN })
  })

  it.each([
    ['too short', VALID_TOKEN.slice(1)],
    ['too long', `${VALID_TOKEN}a`],
    ['not base64url', `${VALID_TOKEN.slice(1)}=`],
    ['missing', undefined],
  ])('rejects a token that is %s', (_label, token) => {
    const result = schema.safeParse({ token })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toContain('token')
  })

  it('rejects unknown keys', () => {
    expect(schema.safeParse({ token: VALID_TOKEN, email: 'x@example.com' }).success).toBe(false)
  })
})
