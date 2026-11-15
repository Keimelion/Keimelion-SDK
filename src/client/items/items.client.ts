import { HttpMethod } from '../../enums/http.js'
import { itemsCreateResponseSchema } from '../../schemas/items/create-item.js'
import type {
  ItemsCreateRequestInput,
  ItemsCreateResponseParsed,
} from '../../schemas/items/create-item.js'
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
  create(input: ItemsCreateRequestInput | FormData): Promise<ItemsCreateResponseParsed>
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
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: ItemsPaths.CREATE,
        body: input,
        responseSchema: itemsCreateResponseSchema,
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
