import { HttpMethod } from '../../enums/http.js'
import { healthGetResponseSchema } from '../../schemas/health/get-health.js'
import type { HealthGetResponseParsed } from '../../schemas/health/get-health.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { HealthPaths } from './health.paths.js'

export interface HealthClient {
  get(): Promise<HealthGetResponseParsed>
}

export function createHealthClient(http: HttpClient): HealthClient {
  return {
    get: () =>
      http.request({
        method: HttpMethod.GET,
        path: HealthPaths.GET,
        auth: RequestAuthMode.NONE,
        responseSchema: healthGetResponseSchema,
      }),
  }
}
