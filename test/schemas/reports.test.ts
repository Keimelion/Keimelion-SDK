import { describe, expect, it } from 'vitest'
import {
  reportsCreateRequestSchema,
  reportsCreateResponseSchema,
} from '../../src/schemas/reports/create-report.js'
import {
  REPORT_DESCRIPTION_MAX_LENGTH,
  type ReportDetailInput,
} from '../../src/schemas/reports/report-detail.js'
import {
  adminReportsGetResponseSchema,
  adminReportsListResponseSchema,
  type AdminReportDetailInput,
} from '../../src/schemas/admin/reports/admin-report-detail.js'
import {
  REPORT_ADMIN_NOTE_MAX_LENGTH,
  adminReportsUpdateRequestSchema,
} from '../../src/schemas/admin/reports/update-report.js'
import { CREATED_AT_ISO, UPDATED_AT_ISO } from '../fixtures.js'

const TARGET_ID = '5f8e2c1a-3b4d-4e6f-8a9b-0c1d2e3f4a5b'

function buildReportDetailWire(): ReportDetailInput {
  return {
    id: '1a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
    userId: '2b0f4f0e-4a59-4a8e-8a51-0f0d6f7b3a11',
    targetType: 'item',
    targetId: TARGET_ID,
    reason: 'spam',
    description: null,
    status: 'pending',
    createdAt: CREATED_AT_ISO,
    updatedAt: UPDATED_AT_ISO,
  }
}

function buildAdminReportDetailWire(): AdminReportDetailInput {
  return {
    ...buildReportDetailWire(),
    reporter: { id: '2b0f4f0e-4a59-4a8e-8a51-0f0d6f7b3a11', username: 'jane' },
    targetSnapshot: { id: TARGET_ID, name: 'Suspicious item' },
    targetImageId: null,
    adminNote: null,
    reviewedByUserId: null,
    reviewedAt: null,
  }
}

describe('reportsCreateRequestSchema', () => {
  it('defaults an omitted description to null', () => {
    const parsed = reportsCreateRequestSchema.parse({
      targetType: 'user',
      targetId: TARGET_ID,
      reason: 'other',
    })

    expect(parsed.description).toBeNull()
  })

  it('trims the description', () => {
    const parsed = reportsCreateRequestSchema.parse({
      targetType: 'list',
      targetId: TARGET_ID,
      reason: 'harassment',
      description: '  insulting title  ',
    })

    expect(parsed.description).toBe('insulting title')
  })

  it('rejects a description longer than the maximum length', () => {
    const result = reportsCreateRequestSchema.safeParse({
      targetType: 'item',
      targetId: TARGET_ID,
      reason: 'spam',
      description: 'a'.repeat(REPORT_DESCRIPTION_MAX_LENGTH + 1),
    })

    expect(result.success).toBe(false)
  })

  it('rejects an unknown target type, reason, a non-uuid target id and unknown keys', () => {
    const result = reportsCreateRequestSchema.safeParse({
      targetType: 'reservation',
      targetId: 'not-a-uuid',
      reason: 'boring',
      extra: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path.join('.') || issue.code)).toEqual([
      'targetType',
      'targetId',
      'reason',
      'unrecognized_keys',
    ])
  })
})

describe('reportsCreateResponseSchema', () => {
  it('decodes the report timestamps into Dates', () => {
    const parsed = reportsCreateResponseSchema.parse({ report: buildReportDetailWire() })

    expect(parsed.report.createdAt).toBeInstanceOf(Date)
    expect(parsed.report.updatedAt.toISOString()).toBe(UPDATED_AT_ISO)
  })
})

describe('adminReportsUpdateRequestSchema', () => {
  it('accepts a null admin note to clear it', () => {
    const parsed = adminReportsUpdateRequestSchema.parse({ adminNote: null })

    expect(parsed).toEqual({ adminNote: null })
  })

  it('rejects moving a report back to pending', () => {
    expect(adminReportsUpdateRequestSchema.safeParse({ status: 'pending' }).success).toBe(false)
  })

  it('rejects an unknown status, an oversized note and unknown keys', () => {
    expect(adminReportsUpdateRequestSchema.safeParse({ status: 'approved' }).success).toBe(false)
    expect(
      adminReportsUpdateRequestSchema.safeParse({
        adminNote: 'a'.repeat(REPORT_ADMIN_NOTE_MAX_LENGTH + 1),
      }).success,
    ).toBe(false)
    expect(adminReportsUpdateRequestSchema.safeParse({ reason: 'spam' }).success).toBe(false)
  })
})

describe('admin report response schemas', () => {
  it('decodes a reviewed report with its snapshot', () => {
    const parsed = adminReportsGetResponseSchema.parse({
      report: {
        ...buildAdminReportDetailWire(),
        status: 'upheld',
        reviewedByUserId: '9c8b7a6d-5e4f-4a3b-8c1d-0e9f8a7b6c5d',
        reviewedAt: UPDATED_AT_ISO,
      },
    })

    expect(parsed.report.reviewedAt).toBeInstanceOf(Date)
    expect(parsed.report.targetSnapshot).toEqual({ id: TARGET_ID, name: 'Suspicious item' })
  })

  it('decodes a paginated list', () => {
    const parsed = adminReportsListResponseSchema.parse({
      items: [buildAdminReportDetailWire()],
      pagination: { page: 1, limit: 20, total: 1, totalPages: 1 },
    })

    expect(parsed.items[0]?.reporter?.username).toBe('jane')
  })
})
