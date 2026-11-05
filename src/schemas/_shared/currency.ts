import { z } from 'zod'
import {
  SUPPORTED_CURRENCY_VALUES,
  SupportedCurrencies,
  type SupportedCurrency,
} from '../../enums/currency.js'

export const DEFAULT_DISPLAY_CURRENCY: SupportedCurrency = SupportedCurrencies.USD

export const supportedCurrencyEnum = z.enum(SupportedCurrencies, {
  error: () => `currency must be one of: ${SUPPORTED_CURRENCY_VALUES.join(', ')}`,
})

export type SupportedCurrencyInput = z.input<typeof supportedCurrencyEnum>
export type SupportedCurrencyParsed = z.output<typeof supportedCurrencyEnum>

export const displayCurrencyQuerySchema = z.object({
  currency: supportedCurrencyEnum.optional(),
})

export type DisplayCurrencyQueryInput = z.input<typeof displayCurrencyQuerySchema>
export type DisplayCurrencyQueryParsed = z.output<typeof displayCurrencyQuerySchema>
