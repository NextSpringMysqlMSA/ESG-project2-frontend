export interface riskState {
  riskType: string
  riskCategory: string
  riskCause: string
  time: string
  impact: string
  financialImpact: string
  businessModelImpact: string
  plans: string
}

export interface scenarioState {
  regions: string
  longitude: number
  latitude: number
  warming: string
  industry: string
  scenario: string
  baseYear: number
  climate: string
  damage: number
  format: string
  responseStrategy: string
}
