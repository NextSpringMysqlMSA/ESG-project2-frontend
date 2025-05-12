export interface riskState {
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

export interface scenarioState {
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
