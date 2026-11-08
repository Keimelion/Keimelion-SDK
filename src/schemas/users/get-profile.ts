import { z } from 'zod'
import { userDetailSchema } from '../_shared/user-detail.js'

export const usersGetProfileResponseSchema = z.object({
  user: userDetailSchema,
})

export type UsersGetProfileResponseInput = z.input<typeof usersGetProfileResponseSchema>
export type UsersGetProfileResponseParsed = z.output<typeof usersGetProfileResponseSchema>
