import api from '@/lib/axios'
import {KPIGoalState} from '@/types/IFRS/goal'

// 리스크 생성 API 호출
export const netZeroApi = async (data: {
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
    console.log('📤 netZero 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/strategy/risk', data)
    console.log('✅ netZero 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ netZero 등록 실패:', error)
    throw error
  }
}

// 시나리오 생성 API 호출
export const kpiGoalApi = async (data: {
  indicator: string
  detailedIndicator: string
  unit: string
  baseYear: number
  goalYear: number
  referenceValue: number
  currentValue: number
  targetValue: number
}) => {
  try {
    console.log('📤 kpi목표 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/goal/KPIGoal', data)
    console.log('✅ kpi목표 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ kpi목표 등록 실패:', error)
    throw error
  }
}

export const fetchKPIGoalList = async (): Promise<KPIGoalState[]> => {
  const response = await api.get('/api/v1/tcfd/goal/KPIGoal')
  return response.data
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
