import { z } from 'zod'

export const VALIDATION_ROOT_PATH = '<root>'

export const validationIssueSchema = z.object({
  path: z.string(),
  message: z.string(),
  code: z.string(),
})

export type ValidationIssueInput = z.input<typeof validationIssueSchema>
export type ValidationIssueParsed = z.output<typeof validationIssueSchema>

export const validationErrorMetadataSchema = z.object({
  issues: z.array(validationIssueSchema),
})

export type ValidationErrorMetadataInput = z.input<typeof validationErrorMetadataSchema>
export type ValidationErrorMetadataParsed = z.output<typeof validationErrorMetadataSchema>

export const apiErrorBodySchema = z.object({
  message: z.string(),
  code: z.string(),
  metadata: z.record(z.string(), z.unknown()),
})

export type ApiErrorBodyInput = z.input<typeof apiErrorBodySchema>
export type ApiErrorBodyParsed = z.output<typeof apiErrorBodySchema>
