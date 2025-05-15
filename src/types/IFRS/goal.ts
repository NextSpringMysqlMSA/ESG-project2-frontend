// 기존 타입 정의...

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

export interface NetZeroPayload {
  industrialSector: string // 산업군
  baseYear: number // 기준 년도
  targetYear: number // 목표 년도
  assets: NetZeroAsset[] // 자산 목록
}

export interface NetZeroResponse extends NetZeroPayload {
  id: number // 넷제로 목표 ID
  memberId: number // 사용자 ID
  industries?: NetZeroAsset[] // 산업별 데이터
  emissions: NetZeroEmission[] // 연도별 배출량
  scenario?: string | null // 시나리오
  createdAt: string // 생성 일시
  updatedAt: string // 수정 일시
}

export interface KPIGoalState {
  id: number
  indicator: string
  detailedIndicator: string
  unit: string
  baseYear?: number // undefined 허용
  goalYear?: number // undefined 허용
  referenceValue?: number // undefined 허용
  currentValue?: number // undefined 허용
  targetValue?: number // undefined 허용
}

export type KPIGoalPayload = Omit<KPIGoalState, 'id'>
