/**
 * ISO 4217 currencies supported by the API for item source prices and
 * read-time FX normalization.
 *
 * The API seeds its `currencies` table from this set: adding or removing a code
 * requires a paired DB migration in Keimelion-API.
 */ export const SupportedCurrencies = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
  CHF: 'CHF',
  CAD: 'CAD',
  AUD: 'AUD',
  JPY: 'JPY',
} as const

export type SupportedCurrency = (typeof SupportedCurrencies)[keyof typeof SupportedCurrencies]

export const SUPPORTED_CURRENCY_VALUES = Object.values(SupportedCurrencies) as [
  SupportedCurrency,
  ...SupportedCurrency[],
]
