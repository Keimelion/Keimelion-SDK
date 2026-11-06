export const ReportReasons = {
  HARASSMENT: 'harassment',
  HATE_VIOLENCE: 'hate_violence',
  SEXUAL_CONTENT: 'sexual_content',
  SCAM_FRAUD: 'scam_fraud',
  SPAM: 'spam',
  ILLEGAL_CONTENT: 'illegal_content',
  PRIVACY: 'privacy',
  OTHER: 'other',
} as const

export type ReportReason = (typeof ReportReasons)[keyof typeof ReportReasons]

export const REPORT_REASON_VALUES = Object.values(ReportReasons) as [
  ReportReason,
  ...ReportReason[],
]
