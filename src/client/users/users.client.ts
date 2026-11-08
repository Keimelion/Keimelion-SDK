import { HttpMethod } from '../../enums/http.js'
import { messageResponseSchema } from '../../schemas/_shared/message-response.js'
import type { MessageResponseParsed } from '../../schemas/_shared/message-response.js'
import type { UsersChangePasswordRequestInput } from '../../schemas/users/change-password.js'
import { usersGetProfileResponseSchema } from '../../schemas/users/get-profile.js'
import type { UsersGetProfileResponseParsed } from '../../schemas/users/get-profile.js'
import { usersListReservationsResponseSchema } from '../../schemas/users/list-reservations.js'
import type {
  UsersListReservationsQueryInput,
  UsersListReservationsResponseParsed,
} from '../../schemas/users/list-reservations.js'
import { usersUpdateProfileResponseSchema } from '../../schemas/users/update-profile.js'
import type {
  UsersUpdateProfileRequestInput,
  UsersUpdateProfileResponseParsed,
} from '../../schemas/users/update-profile.js'
import type { HttpClient } from '../_core/http-client.js'
import type { UsersExportQueryInput } from '../../schemas/users/export-data.js'
import { UsersPaths } from './users.paths.js'

export interface UsersClient {
  // Returns the raw file (JSON by default, ZIP of CSVs with `format: 'csv'`), never parsed.
  exportData(query?: UsersExportQueryInput): Promise<Blob>
  getProfile(): Promise<UsersGetProfileResponseParsed>
  updateProfile(
    input: UsersUpdateProfileRequestInput | FormData,
  ): Promise<UsersUpdateProfileResponseParsed>
  deleteAccount(): Promise<MessageResponseParsed>
  changePassword(input: UsersChangePasswordRequestInput): Promise<MessageResponseParsed>
  listReservations(
    query?: UsersListReservationsQueryInput,
  ): Promise<UsersListReservationsResponseParsed>
}

export function createUsersClient(http: HttpClient): UsersClient {
  return {
    exportData: (query = {}) =>
      http.requestBlob({
        method: HttpMethod.GET,
        path: UsersPaths.EXPORT,
        query,
      }),
    getProfile: () =>
      http.request({
        method: HttpMethod.GET,
        path: UsersPaths.ME,
        responseSchema: usersGetProfileResponseSchema,
      }),
    updateProfile: (input) =>
      http.request({
        method: HttpMethod.PATCH,
        path: UsersPaths.UPDATE_ME,
        body: input,
        responseSchema: usersUpdateProfileResponseSchema,
      }),
    deleteAccount: () =>
      http.request({
        method: HttpMethod.DELETE,
        path: UsersPaths.DELETE_ME,
        responseSchema: messageResponseSchema,
      }),
    changePassword: (input) =>
      http.request({
        method: HttpMethod.POST,
        path: UsersPaths.CHANGE_PASSWORD,
        body: input,
        responseSchema: messageResponseSchema,
      }),
    listReservations: (query = {}) =>
      http.request({
        method: HttpMethod.GET,
        path: UsersPaths.RESERVATIONS,
        query,
        responseSchema: usersListReservationsResponseSchema,
      }),
  }
}
