import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { isoDateTimeSchema } from '../../src/schemas/shared/timestamp.js'
import { CREATED_AT_ISO } from '../fixtures.js'

describe('isoDateTimeSchema', () => {
  it('decodes an ISO string into a Date', () => {
    const decoded = isoDateTimeSchema.parse(CREATED_AT_ISO)

    expect(decoded).toBeInstanceOf(Date)
    expect(decoded.toISOString()).toBe(CREATED_AT_ISO)
  })

  it('accepts an ISO string with a timezone offset', () => {
    const decoded = isoDateTimeSchema.parse('2026-11-05T12:15:30+02:00')

    expect(decoded.toISOString()).toBe(CREATED_AT_ISO)
  })

  it('rejects an invalid date string', () => {
    expect(isoDateTimeSchema.safeParse('not-a-date').success).toBe(false)
    expect(isoDateTimeSchema.safeParse('2026-13-45T99:99:99Z').success).toBe(false)
  })

  it('rejects a Date instance on the wire side', () => {
    expect(isoDateTimeSchema.safeParse(new Date()).success).toBe(false)
  })

  it('encodes a Date back into the ISO wire format', () => {
    expect(z.encode(isoDateTimeSchema, new Date(CREATED_AT_ISO))).toBe(CREATED_AT_ISO)
  })
})
