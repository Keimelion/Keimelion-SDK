import { z } from 'zod'
import { waitlistTokenSchema } from './waitlist-token.js'

export const waitlistConfirmRequestSchema = z.strictObject({
  token: waitlistTokenSchema,
})

export type WaitlistConfirmRequestInput = z.input<typeof waitlistConfirmRequestSchema>
export type WaitlistConfirmRequestParsed = z.output<typeof waitlistConfirmRequestSchema>
