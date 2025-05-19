// NetZero 관련 타입 정의
export interface NetZeroAsset {
  id?: number // 자산 ID (조회 시에만 사용)
  industry: string // 산업 분야
  assetType: string // 자산 유형
  amount: number // 투자액/대출액
  totalAssetValue: number // 총 자산/사업비/기업가치
  emissionFactor?: number // 배출계수
  attributionFactor?: number // 기여도 계수
  baseEmission?: number // 기준 배출량
}

export interface NetZeroEmission {
  year: number // 연도
  emission: number // 배출량
}

// 기본 페이로드 정의
export interface NetZeroPayload {
  industrialSector: string
  baseYear: number
  targetYear: number
  industrialGroup: string // 필수 필드
  assets: NetZeroAsset[]
}

// 생성 시 사용하는 DTO - 페이로드와 동일하거나 추가 정보 포함
export interface NetZeroCreateDTO extends NetZeroPayload {
  // 필요한 경우 추가 필드 정의
  emissions?: NetZeroEmission[] // 선택적으로 초기 배출량 데이터 추가 가능
}

// 업데이트 시 사용하는 DTO - 모든 필드가 선택적(Partial)
export interface NetZeroUpdateDTO extends Partial<NetZeroPayload> {
  // 업데이트 시 모든 필드는 선택적
  emissions?: NetZeroEmission[] // 배출량 데이터도 업데이트 가능
}

// 응답 타입 정의
export interface NetZeroResponse extends NetZeroPayload {
  id: number // 넷제로 목표 ID
  memberId: number // 사용자 ID
  industries?: NetZeroAsset[] // 산업별 데이터
  emissions: NetZeroEmission[] // 연도별 배출량
  scenario?: string | null // 시나리오
  createdAt: string // 생성 일시
  updatedAt: string // 수정 일시
}

//------------------------------------------------------------------

// KPI 목표 관련 DTO 정의
// 기본 필드 구조 정의 (모든 DTO에서 공통으로 사용할 필드)
export interface KPIGoalFields {
  id: number // KPI 목표 ID
  indicator: string
  detailedIndicator: string
  unit: string
  baseYear: number
  goalYear: number
  referenceValue: number
  currentValue: number
  targetValue: number
}

// 생성 요청 시 사용될 DTO
export interface KPIGoalCreateDTO extends Omit<KPIGoalFields, 'id'> {}

// 업데이트 요청 시 사용될 DTO
export interface KPIGoalUpdateDTO extends KPIGoalFields {}

// API 응답으로 받는 DTO (서버에서 추가된 필드 포함)
export type KPIGoalState = KPIGoalFields
