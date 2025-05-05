export interface riskState {
  riskType: string | null
  riskCategory: string
  riskCause: string
  time: string
  impact: string
  financialImpact: string
  businessModelImpact: string
  plans: string
}

export interface scenarioState {
  regions: string | null
  longitude: number | null
  latitude: number | null
  warming: string
  industry: string
  scenario: string
  baseYear: number
  climate: string
  damage: number
  format: string
  responseStrategy: string
}
