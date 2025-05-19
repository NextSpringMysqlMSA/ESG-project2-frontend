import api from '@/lib/axios'
import {
  KPIGoalCreateDTO,
  KPIGoalState,
  NetZeroCreateDTO, // 추가
  NetZeroResponse,
  NetZeroUpdateDTO
} from '@/types/IFRS/goal'

// NetZero 관련 함수
/**
 * 넷제로 목표 생성
 * @param data 넷제로 목표 데이터
 */
export const createNetZero = async (data: NetZeroCreateDTO): Promise<NetZeroResponse> => {
  const response = await api.post('/api/v1/tcfd/netzero', data)
  return response.data
}

/**
 * 넷제로 목표 전체 조회
 * 사용자별 목표 정보를 반환합니다 (JWT 토큰 기반 인증 필요)
 */
export const fetchNetZeroList = async (): Promise<NetZeroResponse[]> => {
  const response = await api.get('/api/v1/tcfd/netzero')
  return response.data
}

/**
 * 넷제로 목표 단건 조회
 * @param id 조회할 넷제로 목표 ID
 */
export const fetchNetZeroById = async (id: number): Promise<NetZeroResponse> => {
  const response = await api.get(`/api/v1/tcfd/netzero/${id}`)
  return response.data
}

/**
 * 넷제로 목표 수정
 * @param id 수정할 넷제로 목표 ID
 * @param data 수정할 데이터
 */
// updateNetZero 함수에서 NetZeroUpdateDTO 타입을 명시적으로 사용
export const updateNetZero = async (
  id: number,
  data: NetZeroUpdateDTO // NetZeroPayload 대신 NetZeroUpdateDTO 사용
): Promise<NetZeroResponse> => {
  const response = await api.put(`/api/v1/tcfd/netzero/${id}`, data)
  return response.data
}
/**
 * 넷제로 목표 삭제
 * @param id 삭제할 넷제로 목표 ID
 */
export const deleteNetZero = async (id: number): Promise<string> => {
  const response = await api.delete(`/api/v1/tcfd/netzero/${id}`)
  return response.data
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
export const createKPIGoal = async (data: KPIGoalCreateDTO): Promise<KPIGoalState> => {
  const response = await api.post('/api/v1/tcfd/goal/kpi', data)
  return response.data
}

// KPI 목표 수정
export const updateKPIGoal = async (
  id: number,
  data: KPIGoalCreateDTO
): Promise<KPIGoalState> => {
  const response = await api.put(`/api/v1/tcfd/goal/kpi/${id}`, data)
  return response.data
}

// KPI 목표 삭제
export const deleteKPIGoal = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/goal/kpi/${id}`)
}
