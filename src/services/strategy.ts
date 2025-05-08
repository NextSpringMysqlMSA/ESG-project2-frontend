import api from '@/lib/axios'

// --------------------------------------------------------------------
export type ScenarioItem = {
  id: number
  regions: string
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

export type CreateScenarioDto = Omit<ScenarioItem, 'id'>
export type UpdateScenarioDto = ScenarioItem

export const fetchScenarioById = async (id: number): Promise<ScenarioItem> => {
  try {
    console.log(`Fetching scenario with ID: ${id}`) // 호출된 ID 출력
    const response = await api.get(`/api/v1/tcfd/strategy/scenario/${id}`)
    console.log('Response data:', response.data) // 응답 데이터 출력
    return response.data
  } catch (error) {
    console.error('Error fetching scenario data:', error) // 에러 로그 추가
    throw error
  }
}

export const fetchScenarioList = async (): Promise<ScenarioItem[]> => {
  const response = await api.get('/api/v1/tcfd/strategy/scenario')
  return response.data
}

export const createScenario = async (scenarioData: CreateScenarioDto) => {
  return await api.post('/api/v1/tcfd/strategy/scenario', scenarioData)
}

export const updateScenario = async (id: number, scenarioData: UpdateScenarioDto) => {
  return await api.put(`/api/v1/tcfd/strategy/scenario/${id}`, scenarioData)
}

export const deleteScenario = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/strategy/scenario/${id}`)
}
// --------------------------------------------------------------------

export type RiskItem = {
  id: number
  riskType: string
  riskCategory: string
  riskCause: string
  time: string
  impact: string
  financialImpact: string
  businessModelImpact: string
  plans: string
}

export type CreateRiskDto = Omit<RiskItem, 'id'>

export type UpdateRiskDto = RiskItem

export const fetchRiskById = async (id: number): Promise<RiskItem> => {
  try {
    console.log(`Fetching risk with ID: ${id}`) // 호출된 ID 출력
    const response = await api.get(`/api/v1/tcfd/strategy/risk/${id}`)
    console.log('Response data:', response.data) // 응답 데이터 출력
    return response.data
  } catch (error) {
    console.error('Error fetching risk data:', error) // 에러 로그 추가
    throw error
  }
}

export const fetchRiskList = async (): Promise<RiskItem[]> => {
  const response = await api.get('/api/v1/tcfd/strategy/risk')
  return response.data
}

export const createRisk = async (riskData: CreateRiskDto) => {
  return await api.post('/api/v1/tcfd/strategy/risk', riskData)
}

export const updateRisk = async (id: number, riskData: UpdateRiskDto) => {
  return await api.put(`/api/v1/tcfd/strategy/risk/${id}`, riskData)
}

export const deleteRisk = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/strategy/risk/${id}`)
}
