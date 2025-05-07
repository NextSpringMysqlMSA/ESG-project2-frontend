import api from '@/lib/axios'

// 리스크 데이터 생성
export const createRisk = async (data: {
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
    const response = await api.post('/api/v1/tcfd/strategy/risk', data)
    return response.data
  } catch (error) {
    console.error('리스크 생성 실패:', error)
    throw error
  }
}

// 리스크 데이터 수정
export const updateRisk = async (
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
    console.error('리스크 수정 실패:', error)
    throw error
  }
}

// 리스크 데이터 삭제
export const deleteRisk = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/strategy/risk/${id}`)
    return response.data
  } catch (error) {
    console.error('리스크 삭제 실패:', error)
    throw error
  }
}

// 시나리오 데이터 생성
export const createScenario = async (data: {
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
    const response = await api.post('/api/v1/tcfd/strategy/scenario', data)
    return response.data
  } catch (error) {
    console.error('시나리오 생성 실패:', error)
    throw error
  }
}

// 시나리오 데이터 수정
export const updateScenario = async (
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
    console.error('시나리오 수정 실패:', error)
    throw error
  }
}

// 시나리오 데이터 삭제
export const deleteScenario = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/strategy/scenario/${id}`)
    return response.data
  } catch (error) {
    console.error('시나리오 삭제 실패:', error)
    throw error
  }
}
