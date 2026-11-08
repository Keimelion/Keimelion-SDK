import { HttpMethod } from '../../enums/http.js'
import { categoriesListResponseSchema } from '../../schemas/categories/list-categories.js'
import type { CategoriesListResponseParsed } from '../../schemas/categories/list-categories.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { CategoriesPaths } from './categories.paths.js'

export interface CategoriesClient {
  list(): Promise<CategoriesListResponseParsed>
}

export function createCategoriesClient(http: HttpClient): CategoriesClient {
  return {
    list: () =>
      http.request({
        method: HttpMethod.GET,
        path: CategoriesPaths.LIST,
        auth: RequestAuthMode.NONE,
        responseSchema: categoriesListResponseSchema,
      }),
  }
}
