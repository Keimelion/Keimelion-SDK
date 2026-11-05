import { z } from 'zod'

export function urlSchema(fieldName: string): z.ZodURL {
  return z.url(`${fieldName} must be a valid URL`)
}

export function httpsUrlSchema(fieldName: string, maxLength: number): z.ZodURL {
  return urlSchema(fieldName)
    .max(maxLength)
    .refine((value) => value.startsWith('https://'), `${fieldName} must use HTTPS`)
}

export type UrlInput = z.input<ReturnType<typeof urlSchema>>
export type UrlParsed = z.output<ReturnType<typeof urlSchema>>
export type HttpsUrlInput = z.input<ReturnType<typeof httpsUrlSchema>>
export type HttpsUrlParsed = z.output<ReturnType<typeof httpsUrlSchema>>
