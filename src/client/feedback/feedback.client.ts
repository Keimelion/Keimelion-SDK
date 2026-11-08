import { HttpMethod } from '../../enums/http.js'
import { feedbackCreateResponseSchema } from '../../schemas/feedback/create-feedback.js'
import type {
  FeedbackCreateRequestInput,
  FeedbackCreateResponseParsed,
} from '../../schemas/feedback/create-feedback.js'
import type { HttpClient } from '../_core/http-client.js'
import { FeedbackPaths } from './feedback.paths.js'

export interface FeedbackClient {
  create(input: FeedbackCreateRequestInput): Promise<FeedbackCreateResponseParsed>
}

export function createFeedbackClient(http: HttpClient): FeedbackClient {
  return {
    create: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: FeedbackPaths.CREATE,
        body: input,
        responseSchema: feedbackCreateResponseSchema,
      }),
  }
}
