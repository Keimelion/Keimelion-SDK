export const ReportStatuses = {
  PENDING: 'pending',
  UPHELD: 'upheld',
  DISMISSED: 'dismissed',
} as const

export type ReportStatus = (typeof ReportStatuses)[keyof typeof ReportStatuses]

export const REPORT_STATUS_VALUES = Object.values(ReportStatuses) as [
  ReportStatus,
  ...ReportStatus[],
]
