export const ReportTargetTypes = {
  USER: 'user',
  LIST: 'list',
  ITEM: 'item',
} as const

export type ReportTargetType = (typeof ReportTargetTypes)[keyof typeof ReportTargetTypes]

export const REPORT_TARGET_TYPE_VALUES = Object.values(ReportTargetTypes) as [
  ReportTargetType,
  ...ReportTargetType[],
]
