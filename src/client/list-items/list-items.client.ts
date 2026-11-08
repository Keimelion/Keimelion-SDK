import { HttpMethod } from '../../enums/http.js'
import { messageResponseSchema } from '../../schemas/_shared/message-response.js'
import type { MessageResponseParsed } from '../../schemas/_shared/message-response.js'
import { listItemsCreateResponseSchema } from '../../schemas/list-items/create-list-item.js'
import type {
  ListItemsCreateRequestInput,
  ListItemsCreateResponseParsed,
} from '../../schemas/list-items/create-list-item.js'
import { listItemsUpdateResponseSchema } from '../../schemas/list-items/update-list-item.js'
import type {
  ListItemsUpdateRequestInput,
  ListItemsUpdateResponseParsed,
} from '../../schemas/list-items/update-list-item.js'
import type { HttpClient } from '../_core/http-client.js'
import { ListItemsPaths } from './list-items.paths.js'

export interface ListItemsClient {
  create(input: ListItemsCreateRequestInput): Promise<ListItemsCreateResponseParsed>
  update(id: string, input: ListItemsUpdateRequestInput): Promise<ListItemsUpdateResponseParsed>
  delete(id: string): Promise<MessageResponseParsed>
}

export function createListItemsClient(http: HttpClient): ListItemsClient {
  return {
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: ListItemsPaths.CREATE,
        body: input,
        responseSchema: listItemsCreateResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: ListItemsPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: listItemsUpdateResponseSchema,
      }),
    delete: (id) =>
      http.request({
        method: HttpMethod.DELETE,
        path: ListItemsPaths.DELETE,
        pathParams: { id },
        responseSchema: messageResponseSchema,
      }),
  }
}
