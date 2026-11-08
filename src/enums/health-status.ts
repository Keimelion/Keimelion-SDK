export const HealthStatuses = {
  OK: 'ok',
  DEGRADED: 'degraded',
} as const

export type HealthStatus = (typeof HealthStatuses)[keyof typeof HealthStatuses]

export const HEALTH_STATUS_VALUES = Object.values(HealthStatuses) as [
  HealthStatus,
  ...HealthStatus[],
]

export const DatabaseHealthStatuses = {
  OK: 'ok',
  ERROR: 'error',
} as const

export type DatabaseHealthStatus =
  (typeof DatabaseHealthStatuses)[keyof typeof DatabaseHealthStatuses]

export const DATABASE_HEALTH_VALUES = Object.values(DatabaseHealthStatuses) as [
  DatabaseHealthStatus,
  ...DatabaseHealthStatus[],
]
