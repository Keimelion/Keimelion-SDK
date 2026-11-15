import { HttpMethod } from '../../enums/http.js'
import { itemsGetResponseSchema } from '../../schemas/items/get-item.js'
import type { ItemsGetResponseParsed } from '../../schemas/items/get-item.js'
import { itemsListResponseSchema } from '../../schemas/items/list-items.js'
import type {
  ItemsListQueryInput,
  ItemsListResponseParsed,
} from '../../schemas/items/list-items.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { ItemsPaths } from './items.paths.js'

export interface ItemsClient {
  list(query?: ItemsListQueryInput): Promise<ItemsListResponseParsed>
  get(id: string): Promise<ItemsGetResponseParsed>
}

export function createItemsClient(http: HttpClient): ItemsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: ItemsPaths.LIST,
        query,
        auth: RequestAuthMode.NONE,
        responseSchema: itemsListResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: ItemsPaths.GET,
        pathParams: { id },
        auth: RequestAuthMode.NONE,
        responseSchema: itemsGetResponseSchema,
      }),
  }
}
