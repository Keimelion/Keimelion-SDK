import { z } from 'zod'
import { supportedCurrencyEnum } from '../_shared/currency.js'
import { userDetailSchema } from '../_shared/user-detail.js'
import { usernameSchema } from '../_shared/username.js'

// JSON contract. The same fields can be sent as multipart/form-data with an `image` file;
// a null username can only be sent as JSON.
export const usersUpdateProfileRequestSchema = z.object({
  username: usernameSchema.nullable().optional(),
  isMarketingOptedIn: z.boolean().optional(),
  defaultCurrency: supportedCurrencyEnum.optional(),
  clearAvatar: z.boolean().optional(),
})

export type UsersUpdateProfileRequestInput = z.input<typeof usersUpdateProfileRequestSchema>
export type UsersUpdateProfileRequestParsed = z.output<typeof usersUpdateProfileRequestSchema>

export const usersUpdateProfileResponseSchema = z.object({
  user: userDetailSchema,
})

export type UsersUpdateProfileResponseInput = z.input<typeof usersUpdateProfileResponseSchema>
export type UsersUpdateProfileResponseParsed = z.output<typeof usersUpdateProfileResponseSchema>
