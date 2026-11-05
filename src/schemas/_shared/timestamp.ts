import { z } from 'zod'

export const isoDateTimeSchema = z.codec(z.iso.datetime({ offset: true }), z.date(), {
  decode: (isoString) => new Date(isoString),
  encode: (date) => date.toISOString(),
})

export type IsoDateTimeInput = z.input<typeof isoDateTimeSchema>
export type IsoDateTimeParsed = z.output<typeof isoDateTimeSchema>
