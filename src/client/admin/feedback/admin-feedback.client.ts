import { HttpMethod } from '../../../enums/http.js'
import {
  adminFeedbackListResponseSchema,
  adminFeedbackUpdateResponseSchema,
} from '../../../schemas/admin/feedback/admin-feedback-detail.js'
import type {
  AdminFeedbackListFilters,
  AdminFeedbackListQueryInput,
  AdminFeedbackListResponseParsed,
  AdminFeedbackUpdateRequestInput,
  AdminFeedbackUpdateResponseParsed,
} from '../../../schemas/admin/feedback/admin-feedback-detail.js'
import type { HttpClient } from '../../_core/http-client.js'
import { AdminFeedbackPaths } from './admin-feedback.paths.js'

export interface AdminFeedbackClient {
  list(
    query?: AdminFeedbackListQueryInput & AdminFeedbackListFilters,
  ): Promise<AdminFeedbackListResponseParsed>
  update(
    id: string,
    input: AdminFeedbackUpdateRequestInput,
  ): Promise<AdminFeedbackUpdateResponseParsed>
}

export function createAdminFeedbackClient(http: HttpClient): AdminFeedbackClient {
  return {
    list: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: AdminFeedbackPaths.LIST,
        query,
        responseSchema: adminFeedbackListResponseSchema,
      }),
    update: (id, input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: AdminFeedbackPaths.UPDATE,
        pathParams: { id },
        body: input,
        responseSchema: adminFeedbackUpdateResponseSchema,
      }),
  }
}
