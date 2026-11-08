import { HttpMethod } from '../../enums/http.js'
import { noContentResponseSchema } from '../../schemas/_shared/no-content.js'
import type { NoContentResponseParsed } from '../../schemas/_shared/no-content.js'
import { listsAddItemResponseSchema } from '../../schemas/lists/add-item.js'
import type {
  ListsAddItemRequestInput,
  ListsAddItemResponseParsed,
} from '../../schemas/lists/add-item.js'
import { listsCreateResponseSchema } from '../../schemas/lists/create-list.js'
import type {
  ListsCreateRequestInput,
  ListsCreateResponseParsed,
} from '../../schemas/lists/create-list.js'
import { listsGetResponseSchema } from '../../schemas/lists/get-list.js'
import type { ListsGetResponseParsed } from '../../schemas/lists/get-list.js'
import { listsListResponseSchema } from '../../schemas/lists/list-lists.js'
import type {
  ListsListQueryInput,
  ListsListResponseParsed,
} from '../../schemas/lists/list-lists.js'
import { listsUpdateResponseSchema } from '../../schemas/lists/update-list.js'
import type {
  ListsUpdateRequestInput,
  ListsUpdateResponseParsed,
} from '../../schemas/lists/update-list.js'
import type { HttpClient } from '../_core/http-client.js'
import { ListsPaths } from './lists.paths.js'

export interface ListsClient {
  list(query?: ListsListQueryInput): Promise<ListsListResponseParsed>
  create(input: ListsCreateRequestInput): Promise<ListsCreateResponseParsed>
  get(id: string): Promise<ListsGetResponseParsed>
  update(id: string, input: ListsUpdateRequestInput): Promise<ListsUpdateResponseParsed>
  delete(id: string): Promise<NoContentResponseParsed>
  addItem(id: string, input: ListsAddItemRequestInput): Promise<ListsAddItemResponseParsed>
}

export function createListsClient(http: HttpClient): ListsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: ListsPaths.LIST,
        query,
        responseSchema: listsListResponseSchema,
      }),
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: ListsPaths.CREATE,
        body: input,
        responseSchema: listsCreateResponseSchema,
      }),
    get: (id) =>
      http.request({
        method: HttpMethod.GET,
        path: ListsPaths.GET,
        pathParams: { id },
        responseSchema: listsGetResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: ListsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: listsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: ListsPaths.DELETE,
        pathParams: { id },
        responseSchema: noContentResponseSchema,
      }),
    addItem: (id, input) =>
      http.request({
        method: HttpMethod.POST,
        path: ListsPaths.ADD_ITEM,
        pathParams: { id },
        body: input,
        responseSchema: listsAddItemResponseSchema,
      }),
  }
}
