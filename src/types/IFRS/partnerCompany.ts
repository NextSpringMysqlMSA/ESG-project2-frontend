/**
 * 백엔드 응답 그대로의 파트너사 정보 타입
 */
export interface PartnerCompanyRaw {
  id?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  industry?: string
  country?: string
  address?: string
  corp_code: string
  corp_name: string
  stock_code?: string
  contract_start_date?: string
  modify_date?: string
}

/**
 * 프론트엔드에서 사용하는 변환된 파트너사 정보 타입
 */
export interface PartnerCompany {
  id?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  industry?: string
  country?: string
  address?: string
  corpCode: string
  corpName: string
  companyName: string
  stockCode?: string
  contractStartDate?: Date | string
  modifyDate?: string
  // 백엔드 호환성을 위한 추가 필드들
  corp_code?: string
  corp_name?: string
  stock_code?: string
  contract_start_date?: string
  modify_date?: string
}

/**
 * Spring Data Page 응답 타입 (변환 후)
 */
export interface PartnerCompanyResponse {
  content: PartnerCompany[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
  // 레거시 호환성을 위한 추가 필드들
  data?: PartnerCompany[]
  total?: number
  page?: number
  pageSize?: number
}

/**
 * Spring Data Page 응답 타입 (서버 원형)
 */
export interface PartnerCompanyResponseRaw {
  content: PartnerCompanyRaw[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
}

/**
 * DART API 기업 정보 타입
 */
export interface DartCorpInfo {
  corpCode: string
  corpName: string
  stockCode?: string
  modifyDate: string
  // 백엔드 호환성을 위한 추가 필드들
  corp_code?: string
  corp_name?: string
  stock_code?: string
  modify_date?: string
}

/**
 * DART API Spring Data Page 응답 타입
 */
export interface DartApiResponse {
  content: DartCorpInfo[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  numberOfElements: number
  first: boolean
  last: boolean
  empty: boolean
  // 레거시 호환성을 위한 추가 필드들
  data?: DartCorpInfo[]
  total?: number
  page?: number
  pageSize?: number
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

export interface FinancialRiskItem {
  description: string
  actualValue: string
  threshold: string
  notes: string | null
  itemNumber: number
  atRisk: boolean
}

export interface FinancialRiskAssessment {
  partnerCompanyId: string
  partnerCompanyName: string
  assessmentYear: string
  reportCode: string
  riskItems: FinancialRiskItem[]
}

/**
 * 프론트에서 사용할 변환 유틸
 */
export function mapPartnerCompany(raw: PartnerCompanyRaw): PartnerCompany {
  return {
    id: raw.id,
    status: raw.status,
    industry: raw.industry,
    country: raw.country,
    address: raw.address,
    corpCode: raw.corp_code,
    corpName: raw.corp_name,
    companyName: raw.corp_name, // companyName을 corp_name으로 매핑
    stockCode: raw.stock_code,
    contractStartDate: raw.contract_start_date
      ? new Date(raw.contract_start_date)
      : undefined,
    modifyDate: raw.modify_date,
    // 백엔드 호환성을 위한 원본 필드들도 포함
    corp_code: raw.corp_code,
    corp_name: raw.corp_name,
    stock_code: raw.stock_code,
    contract_start_date: raw.contract_start_date,
    modify_date: raw.modify_date
  }
}

export function mapPartnerCompanies(rawList: PartnerCompanyRaw[]): PartnerCompany[] {
  // 방어적 코딩: rawList가 배열이 아닌 경우 빈 배열 반환
  if (!Array.isArray(rawList)) {
    console.warn('mapPartnerCompanies: rawList is not an array:', rawList)
    return []
  }

  return rawList.map(mapPartnerCompany)
}
