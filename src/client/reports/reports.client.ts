import { HttpMethod } from '../../enums/http.js'
import { reportsCreateResponseSchema } from '../../schemas/reports/create-report.js'
import type {
  ReportsCreateRequestInput,
  ReportsCreateResponseParsed,
} from '../../schemas/reports/create-report.js'
import type { HttpClient } from '../_core/http-client.js'
import { ReportsPaths } from './reports.paths.js'

export interface ReportsClient {
  create(input: ReportsCreateRequestInput): Promise<ReportsCreateResponseParsed>
}

export function createReportsClient(http: HttpClient): ReportsClient {
  return {
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: ReportsPaths.CREATE,
        body: input,
        responseSchema: reportsCreateResponseSchema,
      }),
  }
}
