import type { z } from 'zod'
import type { KeimelionClient } from '../../../src/client/create-client.js'
import { PAGINATION_WIRE } from '../../fixtures.js'

export interface EndpointCase {
  // `<METHOD> <path template>`, as listed in the API inventory.
  id: string
  call: (client: KeimelionClient) => Promise<unknown>
  wire: unknown
  schema: z.ZodType
  status?: number
  // `bearer` (default): sent from getToken; `none`: public route; otherwise the explicit token.
  auth?: string
  body?: unknown
  query?: Record<string, string | string[]>
  pathOverrides?: Record<string, string>
}

export function paginated<TItem>(item: TItem): {
  items: TItem[]
  pagination: typeof PAGINATION_WIRE
} {
  return { items: [item], pagination: PAGINATION_WIRE }
}
