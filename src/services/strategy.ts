import api from '@/lib/axios'

// 리스크 생성 API 호출
export const riskApi = async (data: {
  riskType: string
  riskCategory: string
  riskCause: string
  time: string
  impact: string
  financialImpact: string
  businessModelImpact: string
  plans: string
}) => {
  try {
    console.log('📤 리스크 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/strategy/risk', data)
    console.log('✅ 리스크 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 리스크 등록 실패:', error)
    throw error
  }
}

// 시나리오 생성 API 호출
export const scenarioApi = async (data: {
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
}) => {
  try {
    console.log('📤 시나리오 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/strategy/scenario', data)
    console.log('✅ 시나리오 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 시나리오 등록 실패:', error)
    throw error
  }
}

// Scenario 수정
export const updateScenarioApi = async (
  id: number,
  data: {
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
) => {
  try {
    const response = await api.put(`/api/v1/tcfd/strategy/scenario/${id}`, data)
    return response.data
  } catch (error) {
    console.error('❌ 시나리오 수정 실패:', error)
    throw error
  }
}

// Scenario 삭제
export const deleteScenarioApi = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/strategy/scenario/${id}`)
    return response.data
  } catch (error) {
    console.error('❌ 시나리오 삭제 실패:', error)
    throw error
  }
}

// Risk 수정
export const updateRiskApi = async (
  id: number,
  data: {
    riskType: string
    riskCategory: string
    riskCause: string
    time: string
    impact: string
    financialImpact: string
    businessModelImpact: string
    plans: string
  }
) => {
  try {
    const response = await api.put(`/api/v1/tcfd/strategy/risk/${id}`, data)
    return response.data
  } catch (error) {
    console.error('❌ 리스크 수정 실패:', error)
    throw error
  }
}

// Risk 삭제
export const deleteRiskApi = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/strategy/risk/${id}`)
    return response.data
  } catch (error) {
    console.error('❌ 리스크 삭제 실패:', error)
    throw error
  }
}
