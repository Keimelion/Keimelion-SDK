import { HttpMethod } from '../../../enums/http.js'
import {
  adminReportsGetResponseSchema,
  adminReportsListResponseSchema,
} from '../../../schemas/admin/reports/admin-report-detail.js'
import type {
  AdminReportsGetResponseParsed,
  AdminReportsListFilters,
  AdminReportsListQueryInput,
  AdminReportsListResponseParsed,
} from '../../../schemas/admin/reports/admin-report-detail.js'
import { adminReportsUpdateResponseSchema } from '../../../schemas/admin/reports/update-report.js'
import type {
  AdminReportsUpdateRequestInput,
  AdminReportsUpdateResponseParsed,
} from '../../../schemas/admin/reports/update-report.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminReportsPaths } from './admin-reports.paths.js'

export interface AdminReportsClient {
  list(
    query?: AdminReportsListQueryInput & AdminReportsListFilters,
  ): Promise<AdminReportsListResponseParsed>
  get(id: string): Promise<AdminReportsGetResponseParsed>
  update(
    id: string,
    input: AdminReportsUpdateRequestInput,
  ): Promise<AdminReportsUpdateResponseParsed>
}

export function createAdminReportsClient(http: HttpClient): AdminReportsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminReportsPaths.LIST,
        query,
        responseSchema: adminReportsListResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminReportsPaths.GET,
        pathParams: { id },
        responseSchema: adminReportsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminReportsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminReportsUpdateResponseSchema,
      }),
  }
}
