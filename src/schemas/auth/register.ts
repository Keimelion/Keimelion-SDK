import { z } from 'zod'
import { passwordSchema } from '../_shared/password.js'
import { usernameSchema } from '../_shared/username.js'
import { supportedCurrencyEnum } from '../_shared/currency.js'
import { userDetailSchema } from '../_shared/user-detail.js'
import { emailSchema } from '../_shared/email.js'

const optionalUsernameSchema = usernameSchema
  .nullable()
  .optional()
  .transform((value) => value ?? null)

export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: optionalUsernameSchema,
  isMarketingOptedIn: z.boolean().default(false),
  defaultCurrency: supportedCurrencyEnum.optional(),
})

export type RegisterRequestInput = z.input<typeof registerRequestSchema>
export type RegisterRequestParsed = z.output<typeof registerRequestSchema>

export const registerResponseSchema = z.object({
  user: userDetailSchema,
  refreshToken: z.string(),
})

export type RegisterResponseInput = z.input<typeof registerResponseSchema>
export type RegisterResponseParsed = z.output<typeof registerResponseSchema>
