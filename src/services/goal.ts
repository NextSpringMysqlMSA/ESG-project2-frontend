import api from '@/lib/axios'
import {KPIGoalState, KPIGoalPayload, NetZeroPayload} from '@/types/IFRS/goal'

// goal.ts 파일 내에 있어야 함
export const createNetZero = async (data: NetZeroPayload) => {
  try {
    const response = await api.post('/api/v1/tcfd/strategy/netZero', data)
    return response.data
  } catch (error) {
    console.error('NetZero 등록 실패:', error)
    throw error
  }
}

/**
 * KPI 목표 생성 API 호출
 */
export const createKPIGoal = async (data: KPIGoalPayload) => {
  try {
    const response = await api.post('/api/v1/tcfd/goal/kpi', data)
    return response.data
  } catch (error) {
    console.error('KPI 목표 등록 실패:', error)
    throw error
  }
}

/**
 * KPI 목표 전체 조회 API 호출
 */
export const fetchKPIGoal = async (): Promise<KPIGoalState[]> => {
  try {
    const response = await api.get('/api/v1/tcfd/goal/kpi')
    return response.data
  } catch (error) {
    console.error('KPI 목표 조회 실패:', error)
    throw error
  }
}

/**
 * KPI 목표 수정 API 호출
 */
export const updateKPIGoal = async (id: number, data: KPIGoalPayload) => {
  try {
    const response = await api.put(`/api/v1/tcfd/goal/kpi/${id}`, data)
    return response.data
  } catch (error) {
    console.error(`KPI 목표 수정 실패 (ID: ${id}):`, error)
    throw error
  }
}

/**
 * KPI 목표 삭제 API 호출
 */
export const deleteKPIGoal = async (id: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/goal/kpi/${id}`)
    return response.data
  } catch (error) {
    console.error(`KPI 목표 삭제 실패 (ID: ${id}):`, error)
    throw error
  }
}
