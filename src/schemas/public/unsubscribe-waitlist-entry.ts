import { z } from 'zod'
import { waitlistTokenSchema } from './waitlist-token.js'

export const waitlistUnsubscribeRequestSchema = z.strictObject({
  token: waitlistTokenSchema,
})

export type WaitlistUnsubscribeRequestInput = z.input<typeof waitlistUnsubscribeRequestSchema>
export type WaitlistUnsubscribeRequestParsed = z.output<typeof waitlistUnsubscribeRequestSchema>
