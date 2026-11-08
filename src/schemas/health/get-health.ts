import { z } from 'zod'
import { DATABASE_HEALTH_VALUES, HEALTH_STATUS_VALUES } from '../../enums/health-status.js'
import { isoDateTimeSchema } from '../_shared/timestamp.js'

export const healthGetResponseSchema = z.object({
  status: z.enum(HEALTH_STATUS_VALUES),
  database: z.enum(DATABASE_HEALTH_VALUES),
  timestamp: isoDateTimeSchema,
  version: z.string(),
})

export type HealthGetResponseInput = z.input<typeof healthGetResponseSchema>
export type HealthGetResponseParsed = z.output<typeof healthGetResponseSchema>
