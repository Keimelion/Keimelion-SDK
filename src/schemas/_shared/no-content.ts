import { z } from 'zod'

// Response schema for 204 No Content endpoints: the client resolves them to `undefined`.
export const noContentResponseSchema = z.undefined()

export type NoContentResponseInput = z.input<typeof noContentResponseSchema>
export type NoContentResponseParsed = z.output<typeof noContentResponseSchema>
