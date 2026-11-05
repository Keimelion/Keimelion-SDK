import { z } from 'zod'
import { AUTH_PROVIDER_VALUES } from '../../enums/auth-provider.js'
import { USER_ROLE_VALUES } from '../../enums/user-role.js'
import { supportedCurrencyEnum } from '../_shared/currency.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'
import { imageDetailSchema } from '../_shared/image-detail.js'

export const userDetailSchema = z.object({
  id: z.guid(),
  email: z.string(),
  username: z.string().nullable(),
  authProvider: z.enum(AUTH_PROVIDER_VALUES),
  role: z.enum(USER_ROLE_VALUES),
  avatarImageId: z.guid().nullable(),
  avatar: imageDetailSchema.nullable(),
  isCgvAccepted: z.boolean(),
  cgvAcceptedAt: isoDateTimeSchema.nullable(),
  isMarketingOptedIn: z.boolean(),
  defaultCurrency: supportedCurrencyEnum,
  emailVerifiedAt: isoDateTimeSchema.nullable(),
  lastActiveAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type UserDetailInput = z.input<typeof userDetailSchema>
export type UserDetailParsed = z.output<typeof userDetailSchema>
