import { describe, expect, it } from 'vitest'
import {
  MAX_WAITLIST_EMAIL_LENGTH,
  MAX_WAITLIST_HONEYPOT_LENGTH,
  waitlistCreateRequestSchema,
  waitlistCreateResponseSchema,
} from '../../src/schemas/public/create-waitlist-entry.js'

const VALID_REQUEST = { email: 'visitor@example.com', locale: 'fr', consent: true }
const EMAIL_DOMAIN = '@example.com'

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
  it.each(['subscribed', 'already_subscribed'])('accepts the %s status', (status) => {
    expect(waitlistCreateResponseSchema.parse({ status })).toEqual({ status })
  })

  it('rejects an unknown status', () => {
    expect(waitlistCreateResponseSchema.safeParse({ status: 'pending' }).success).toBe(false)
  })
})
