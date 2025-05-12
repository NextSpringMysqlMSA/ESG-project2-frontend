import api from '@/lib/axios'
import {
  CreateRiskDto,
  CreateScenarioDto,
  RiskItem,
  ScenarioItem,
  UpdateRiskDto,
  UpdateScenarioDto
} from '@/types/IFRS/strategy'

// ========================= 시나리오 관련 API 및 타입 ===============================================

/**
 * ID로 특정 시나리오를 조회하는 API 함수
 * @param id 조회할 시나리오의 ID
 * @returns 시나리오 상세 정보
 */
export const fetchScenarioById = async (id: number): Promise<ScenarioItem> => {
  try {
    console.log(`Fetching scenario with ID: ${id}`) // 호출된 ID 출력 (디버깅용)
    const response = await api.get(`/api/v1/tcfd/strategy/scenario/${id}`)
    console.log('Response data:', response.data) // 응답 데이터 출력 (디버깅용)
    return response.data
  } catch (error) {
    console.error('Error fetching scenario data:', error) // 에러 로그 추가 (디버깅용)
    throw error
  }
}

/**
 * 모든 시나리오 목록을 조회하는 API 함수
 * @returns 시나리오 항목 배열
 */
export const fetchScenarioList = async (): Promise<ScenarioItem[]> => {
  const response = await api.get('/api/v1/tcfd/strategy/scenario')
  return response.data
}

/**
 * 새로운 시나리오를 생성하는 API 함수
 * @param scenarioData 생성할 시나리오 데이터
 * @returns API 응답 (생성된 시나리오 정보)
 */
export const createScenario = async (scenarioData: CreateScenarioDto) => {
  return await api.post('/api/v1/tcfd/strategy/scenario', scenarioData)
}

/**
 * 기존 시나리오를 수정하는 API 함수
 * @param id 수정할 시나리오 ID
 * @param scenarioData 수정할 시나리오 데이터
 * @returns API 응답 (수정된 시나리오 정보)
 */
export const updateScenario = async (id: number, scenarioData: UpdateScenarioDto) => {
  return await api.put(`/api/v1/tcfd/strategy/scenario/${id}`, scenarioData)
}

/**
 * 시나리오를 삭제하는 API 함수
 * @param id 삭제할 시나리오 ID
 * @returns API 응답 (삭제 결과)
 */
export const deleteScenario = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/strategy/scenario/${id}`)
}

// ========================= 리스크 관련 API 및 타입 ===============================================

/**
 * ID로 특정 리스크를 조회하는 API 함수
 * @param id 조회할 리스크의 ID
 * @returns 리스크 상세 정보
 */
export const fetchRiskById = async (id: number): Promise<RiskItem> => {
  try {
    console.log(`Fetching risk with ID: ${id}`) // 호출된 ID 출력 (디버깅용)
    const response = await api.get(`/api/v1/tcfd/strategy/risk/${id}`)
    console.log('Response data:', response.data) // 응답 데이터 출력 (디버깅용)
    return response.data
  } catch (error) {
    console.error('Error fetching risk data:', error) // 에러 로그 추가 (디버깅용)
    throw error
  }
}

/**
 * 모든 리스크 목록을 조회하는 API 함수
 * @returns 리스크 항목 배열
 */
export const fetchRiskList = async (): Promise<RiskItem[]> => {
  const response = await api.get('/api/v1/tcfd/strategy/risk')
  return response.data
}

/**
 * 새로운 리스크를 생성하는 API 함수
 * @param riskData 생성할 리스크 데이터
 * @returns API 응답 (생성된 리스크 정보)
 */
export const createRisk = async (riskData: CreateRiskDto) => {
  return await api.post('/api/v1/tcfd/strategy/risk', riskData)
}

/**
 * 기존 리스크를 수정하는 API 함수
 * @param id 수정할 리스크 ID
 * @param riskData 수정할 리스크 데이터
 * @returns API 응답 (수정된 리스크 정보)
 */
export const updateRisk = async (id: number, riskData: UpdateRiskDto) => {
  return await api.put(`/api/v1/tcfd/strategy/risk/${id}`, riskData)
}

/**
 * 리스크를 삭제하는 API 함수
 * @param id 삭제할 리스크 ID
 * @returns API 응답 (삭제 결과)
 */
export const deleteRisk = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/strategy/risk/${id}`)
}
