import { z } from 'zod'
import { reservationDetailSchema } from '../_shared/reservation-detail.js'

export const reservationsGetResponseSchema = z.object({
  reservation: reservationDetailSchema,
})

export type ReservationsGetResponseInput = z.input<typeof reservationsGetResponseSchema>
export type ReservationsGetResponseParsed = z.output<typeof reservationsGetResponseSchema>
