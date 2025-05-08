export interface NetZeroState {
  id: number
  industrialGroup: string
  scenario: string
  baseYear: number
  midTargetYear: number
  finalTargetYear: number
  baseYearScope1: number
  baseYearScope2: number
  baseYearScope3: number
}

export type NetZeroPayload = Omit<NetZeroState, 'id'>

export interface KPIGoalState {
  id: number
  indicator: string
  detailedIndicator: string
  unit: string
  baseYear: number
  goalYear: number
  referenceValue: number
  currentValue: number
  targetValue: number
}

export type KPIGoalPayload = Omit<KPIGoalState, 'id'>
