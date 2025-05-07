export interface netZeroState {
  industrialGroup: string
  scenario: string
  baseYear: number
  midTargetYear: number
  finalTargetYear: number
  baseYearScope1: number
  baseYearScope2: number
  baseYearScope3: number
}
export interface KPIGoalState {
  indicator: string
  detailedIndicator: string
  unit: string
  baseYear: number
  goalYear: number
  referenceValue: number
  currentValue: number
  targetValue: number
}
