import { HttpMethod } from '../../enums/http.js'
import { waitlistCreateResponseSchema } from '../../schemas/public/create-waitlist-entry.js'
import type {
  WaitlistCreateRequestInput,
  WaitlistCreateResponseParsed,
} from '../../schemas/public/create-waitlist-entry.js'
import { publicListsGetResponseSchema } from '../../schemas/public/get-public-list.js'
import type { PublicListsGetResponseParsed } from '../../schemas/public/get-public-list.js'
import { RequestAuthMode } from '../_core/http-client.js'
import type { HttpClient } from '../_core/http-client.js'
import { PublicPaths } from './public.paths.js'

export interface PublicClient {
  getList(slug: string): Promise<PublicListsGetResponseParsed>
  createWaitlistEntry(input: WaitlistCreateRequestInput): Promise<WaitlistCreateResponseParsed>
}

export function createPublicClient(http: HttpClient): PublicClient {
  return {
    getList: (slug) =>
      http.request({
        method: HttpMethod.GET,
        path: PublicPaths.GET_LIST,
        pathParams: { slug },
        auth: RequestAuthMode.NONE,
        responseSchema: publicListsGetResponseSchema,
      }),
    createWaitlistEntry: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: PublicPaths.CREATE_WAITLIST_ENTRY,
        body: input,
        auth: RequestAuthMode.NONE,
        responseSchema: waitlistCreateResponseSchema,
      }),
  }
}
