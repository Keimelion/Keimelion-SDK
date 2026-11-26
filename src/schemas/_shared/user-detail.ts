import { z } from 'zod'
import { AUTH_PROVIDER_VALUES } from '../../enums/auth-provider.js'
import { USER_ROLE_VALUES } from '../../enums/user-role.js'
import { supportedCurrencyEnum } from './currency.js'
import { isoDateTimeSchema } from './timestamp.js'
import { imageDetailSchema } from './image-detail.js'

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
  // Computed, never stored: createdAt + the API grace period while the email is not verified,
  // null once it is. From that instant login and refresh answer 403 EMAIL_NOT_VERIFIED.
  emailVerificationDeadlineAt: isoDateTimeSchema.nullable(),
  lastActiveAt: isoDateTimeSchema.nullable(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

export type UserDetailInput = z.input<typeof userDetailSchema>
export type UserDetailParsed = z.output<typeof userDetailSchema>
