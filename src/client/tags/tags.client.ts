import { HttpMethod } from '../../enums/http.js'
import { tagsListResponseSchema } from '../../schemas/tags/list-tags.js'
import type { TagsListQueryInput, TagsListResponseParsed } from '../../schemas/tags/list-tags.js'
import type { HttpClient } from '../_core/http-client.js'
import { TagsPaths } from './tags.paths.js'

export interface TagsClient {
  list(query?: TagsListQueryInput): Promise<TagsListResponseParsed>
}

export function createTagsClient(http: HttpClient): TagsClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: TagsPaths.LIST,
        query,
        responseSchema: tagsListResponseSchema,
      }),
  }
}
