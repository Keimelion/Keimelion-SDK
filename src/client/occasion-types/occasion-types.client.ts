import { HttpMethod } from '../../enums/http.js'
import { occasionTypesListResponseSchema } from '../../schemas/occasion-types/list-occasion-types.js'
import type { OccasionTypesListResponseParsed } from '../../schemas/occasion-types/list-occasion-types.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { OccasionTypesPaths } from './occasion-types.paths.js'

export interface OccasionTypesClient {
  list(): Promise<OccasionTypesListResponseParsed>
}

export function createOccasionTypesClient(http: HttpClient): OccasionTypesClient {
  return {
    list: () =>
      http.request({
        method: HttpMethod.GET,
        path: OccasionTypesPaths.LIST,
        auth: RequestAuthMode.NONE,
        responseSchema: occasionTypesListResponseSchema,
      }),
  }
}
