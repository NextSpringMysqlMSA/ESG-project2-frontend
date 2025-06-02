/**
 * 파트너사(협력사) 정보 타입
 */
export interface PartnerCompany {
  id?: string // 파트너사 고유 ID
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' // 파트너사 상태
  industry?: string // 산업군
  country?: string // 국가
  address?: string // 주소
  corp_code: string // DART corp_code
  corp_name: string // 회사명 (API 응답 필드)
  stock_code?: string // 주식 코드
  contract_start_date?: string // 계약 시작일 (API 응답 필드 - YYYY-MM-DD 문자열)
  modify_date?: string // 수정일
  // 프론트엔드에서 사용할 필드 (API 응답을 변환하여 채움)
  companyName: string
  contractStartDate: Date
}

/**
 * 파트너사 목록 API 응답 타입 (페이지네이션 포함)
 */
export interface PartnerCompanyResponse {
  data: PartnerCompany[]
  total: number
  page: number
  pageSize: number
}

/**
 * DART API 기업 정보 타입
 */
export interface DartCorpInfo {
  corp_code: string // 기업 고유 코드
  corp_name: string // 기업명
  stock_code?: string // 주식 코드 (상장사만 존재)
  modify_date: string // 최종 수정일
}

/**
 * DART API 페이지네이션 응답 타입
 */
export interface DartApiResponse {
  data: DartCorpInfo[] // 기업 정보 목록
  total: number // 전체 항목 수
  page: number // 현재 페이지 번호
  pageSize: number // 페이지 당 항목 수
  totalPages: number // 전체 페이지 수
  hasNextPage: boolean // 다음 페이지 존재 여부
}

/**
 * 기업 검색 파라미터 타입
 */
export interface SearchCorpParams {
  page?: number
  pageSize?: number
  listedOnly?: boolean
  corpNameFilter?: string
}
