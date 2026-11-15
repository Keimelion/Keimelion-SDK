import { z } from 'zod'
import { SupportedCurrencies, type SupportedCurrency } from '../../enums/currency.js'
import { httpsUrlSchema } from './url.js'

export const MAX_SOURCE_URL_LENGTH = 2048
export const DEFAULT_SOURCE_CURRENCY: SupportedCurrency = SupportedCurrencies.EUR

const PRICE_REGEX = /^\d{1,8}(\.\d{1,2})?$/

export const itemSourceUrlSchema = httpsUrlSchema('sourceUrl', MAX_SOURCE_URL_LENGTH)

export type ItemSourceUrlInput = z.input<typeof itemSourceUrlSchema>
export type ItemSourceUrlParsed = z.output<typeof itemSourceUrlSchema>

export const itemSourcePriceSchema = z
  .string()
  .regex(
    PRICE_REGEX,
    'price must be a decimal with up to 8 digits before the dot and 2 after (e.g. 19.99)',
  )

export type ItemSourcePriceInput = z.input<typeof itemSourcePriceSchema>
export type ItemSourcePriceParsed = z.output<typeof itemSourcePriceSchema>
