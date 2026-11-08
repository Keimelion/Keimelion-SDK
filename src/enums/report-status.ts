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

// Statuses an admin can move a report to: a reviewed report never goes back to pending.
export const REVIEWED_REPORT_STATUS_VALUES = [ReportStatuses.UPHELD, ReportStatuses.DISMISSED] as const
