import { describe, expect, it } from 'vitest'
import { ReportsPaths } from '../../../src/client/reports/reports.paths.js'
import { createClient } from '../../../src/client/create-client.js'
import { CREATED_AT_ISO, UPDATED_AT_ISO } from '../../fixtures.js'
import { jsonResponse, mockFetchResponse, recordedHeaders } from '../fetch-mock.js'

const BASE_URL = 'https://api.example.com'
const TARGET_ID = '5f8e2c1a-3b4d-4e6f-8a9b-0c1d2e3f4a5b'

describe('client.reports', () => {
  it('create posts the report with the bearer token and returns the decoded report', async () => {
    const wire = {
      report: {
        id: '1a2b3c4d-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
        userId: '2b0f4f0e-4a59-4a8e-8a51-0f0d6f7b3a11',
        targetType: 'list',
        targetId: TARGET_ID,
        reason: 'hate_violence',
        description: null,
        status: 'pending',
        createdAt: CREATED_AT_ISO,
        updatedAt: UPDATED_AT_ISO,
      },
    }
    const { fetch, calls } = mockFetchResponse(jsonResponse(wire, 201))
    const client = createClient({ baseUrl: BASE_URL, getToken: () => 'jwt', fetch })

    const { report } = await client.reports.create({
      targetType: 'list',
      targetId: TARGET_ID,
      reason: 'hate_violence',
    })

    expect(calls[0]?.url).toBe(`${BASE_URL}${ReportsPaths.CREATE}`)
    expect(calls[0]?.init.method).toBe('POST')
    expect(recordedHeaders(calls[0]).Authorization).toBe('Bearer jwt')
    expect(report.status).toBe('pending')
    expect(report.createdAt).toEqual(new Date(CREATED_AT_ISO))
  })
})
