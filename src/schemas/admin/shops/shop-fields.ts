import { z } from 'zod'
import { httpsUrlSchema } from '../../_shared/url.js'

const MIN_SHOP_NAME_LENGTH = 1
const MAX_SHOP_NAME_LENGTH = 120
const MAX_SHOP_DOMAIN_LENGTH = 253
const MAX_SHOP_LOGO_URL_LENGTH = 2048
const ASCII_HOSTNAME_REGEX =
  /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*$/

function normalizeShopDomain(value: string): string {
  const lowered = value.toLowerCase()
  const withProtocol =
    lowered.startsWith('http://') || lowered.startsWith('https://') ? lowered : `https://${lowered}`
  return extractHostname(withProtocol, lowered)
    .replace(/\/$/, '')
    .replace(/^www\./, '')
}

function extractHostname(url: string, fallback: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return fallback
  }
}

export const shopNameSchema = z.string().trim().min(MIN_SHOP_NAME_LENGTH).max(MAX_SHOP_NAME_LENGTH)

export type ShopNameInput = z.input<typeof shopNameSchema>
export type ShopNameParsed = z.output<typeof shopNameSchema>

export const shopDomainSchema = z
  .string()
  .trim()
  .transform(normalizeShopDomain)
  .pipe(
    z
      .string()
      .max(MAX_SHOP_DOMAIN_LENGTH)
      .regex(
        ASCII_HOSTNAME_REGEX,
        'domain must be a valid hostname (lowercase letters, digits, dots, and dashes)',
      ),
  )
  .nullable()

export type ShopDomainInput = z.input<typeof shopDomainSchema>
export type ShopDomainParsed = z.output<typeof shopDomainSchema>

export const shopLogoUrlSchema = httpsUrlSchema('logoUrl', MAX_SHOP_LOGO_URL_LENGTH).nullable()

export type ShopLogoUrlInput = z.input<typeof shopLogoUrlSchema>
export type ShopLogoUrlParsed = z.output<typeof shopLogoUrlSchema>
