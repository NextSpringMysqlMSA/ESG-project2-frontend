import api from '@/lib/axios'

// ========================= 시나리오 관련 API 및 타입 ===============================================
/**
 * 시나리오 항목의 전체 데이터 타입 정의
 * 백엔드 API와 통신할 때 사용되는 데이터 구조
 */
export type ScenarioItem = {
  id: number // 시나리오 고유 ID
  regions: string // 행정구역
  longitude: number | null // 경도
  latitude: number | null // 위도
  assetType: string // 자산 유형 (이전: damage)
  industry: string // 산업 분야
  scenario: string // SSP 시나리오
  baseYear: number // 분석 기준 연도
  climate: string // 기후 지표
  assetValue: number // 자산 가치 (이전: warming)
  estimatedDamage: number // 예상 피해액
}

// 시나리오 생성 시 사용되는 DTO 타입 (id 제외)
export type CreateScenarioDto = Omit<ScenarioItem, 'id'>
// 시나리오 수정 시 사용되는 DTO 타입 (전체 필드 포함)
export type UpdateScenarioDto = ScenarioItem

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
// --------------------------------------------------------------------

// ========================= 리스크 관련 API 및 타입 ===============================================
/**
 * 리스크 항목의 전체 데이터 타입 정의
 * 백엔드 API와 통신할 때 사용되는 데이터 구조
 */
export type RiskItem = {
  id: number // 리스크 고유 ID
  riskType: string // 리스크 종류
  riskCategory: string // 리스크 카테고리
  riskCause: string // 리스크 요인
  time: string // 시점
  impact: string // 영향도
  financialImpact: string // 잠재적 재무 영향
  businessModelImpact: string // 사업 모델 및 가치 사슬에 대한 영향
  plans: string // 내용 현황 및 계획
}

// 리스크 생성 시 사용되는 DTO 타입 (id 제외)
export type CreateRiskDto = Omit<RiskItem, 'id'>
// 리스크 수정 시 사용되는 DTO 타입 (전체 필드 포함)
export type UpdateRiskDto = RiskItem

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
