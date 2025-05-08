import api from '@/lib/axios'
import {KPIGoalState, KPIGoalPayload, NetZeroPayload} from '@/types/IFRS/goal'

// NetZero 관련 함수
export const createNetZero = async (data: NetZeroPayload) => {
  return await api.post('/api/v1/tcfd/strategy/netZero', data)
}

//-------------------------------------------------------------------------------------------
// KPI 목표 관련 함수

// 개별 KPI 목표 조회 함수 추가
export const fetchKpiGoalById = async (id: number): Promise<KPIGoalState> => {
  const response = await api.get(`/api/v1/tcfd/goal/kpi/${id}`)
  return response.data
}

// KPI 목표 전체 조회
export const fetchKPIGoal = async (): Promise<KPIGoalState[]> => {
  const response = await api.get('/api/v1/tcfd/goal/kpi')
  return response.data
}

// KPI 목표 생성
export const createKPIGoal = async (data: KPIGoalPayload) => {
  return await api.post('/api/v1/tcfd/goal/kpi', data)
}

// KPI 목표 수정
export const updateKPIGoal = async (id: number, data: KPIGoalPayload) => {
  return await api.put(`/api/v1/tcfd/goal/kpi/${id}`, data)
}

// KPI 목표 삭제
export const deleteKPIGoal = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/goal/kpi/${id}`)
}
