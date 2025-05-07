import api from '@/lib/axios'
import {KPIGoalState} from '@/types/IFRS/goal'

// 리스크 생성 API 호출
export const createNetZero = async (data: {
  industrialGroup: string
  scenario: string
  baseYear: number
  midTargetYear: number
  finalTargetYear: number
  baseYearScope1: number
  baseYearScope2: number
  baseYearScope3: number
}) => {
  try {
    console.log('📤 netZero 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/strategy/netZero', data)
    console.log('✅ netZero 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ netZero 등록 실패:', error)
    throw error
  }
}

// 시나리오 생성 API 호출
export const createKPIGoal = async (data: {
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

export const fetchKPIGoal = async (): Promise<KPIGoalState[]> => {
  const response = await api.get('/api/v1/tcfd/goal/KPIGoal')
  return response.data
}
