const API_BASE_URL = process.env.NEXT_DART_API_URL || '/api' // 환경 변수 또는 기본값 사용

import {useAuthStore} from '@/stores/authStore'
import {
  DartApiResponse,
  PartnerCompany,
  PartnerCompanyResponse,
  SearchCorpParams
} from '@/types/IFRS/partnerCompany'

// 파트너사 API 엔드포인트
const PARTNER_COMPANIES_BASE_PATH = '/api/v1/partners/partner-companies'
const UNIQUE_PARTNER_COMPANY_NAMES_ENDPOINT = `${API_BASE_URL}/api/v1/partners/unique-partner-companies`
const DART_CORP_CODES_ENDPOINT = `${API_BASE_URL}/api/v1/dart/corp-codes`

/**
 * 파트너사 목록을 조회합니다. (페이지네이션 지원)
 * @param page 페이지 번호 (기본값: 1)
 * @param pageSize 페이지당 항목 수 (기본값: 10)
 * @param companyNameFilter 회사명 필터 (선택사항)
 * @returns 파트너사 목록 응답
 */
export async function fetchPartnerCompanies(
  page = 1,
  pageSize = 10,
  companyNameFilter?: string
): Promise<PartnerCompanyResponse> {
  try {
    const url = new URL(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}`)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('pageSize', pageSize.toString())

    if (companyNameFilter) {
      url.searchParams.append('companyName', companyNameFilter)
    }

    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(
        `파트너사 목록을 가져오는 중 오류가 발생했습니다: ${response.status}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('파트너사 목록을 가져오는 중 오류:', error)
    throw error
  }
}

/**
 * 특정 파트너사의 상세 정보를 조회합니다.
 * @param id 파트너사 ID (UUID)
 * @returns 파트너사 정보
 */
export async function fetchPartnerCompanyById(
  id: string
): Promise<PartnerCompany | null> {
  try {
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`, {
      method: 'GET',
      headers
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`파트너사 정보를 가져오는데 실패했습니다: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('파트너사 정보 조회 오류:', error)
    throw error
  }
}

/**
 * 새로운 파트너사를 등록합니다.
 * @param partnerInput 등록할 파트너사 정보
 * @returns 등록된 파트너사 정보
 */
export async function createPartnerCompany(partnerInput: {
  companyName: string
  corpCode: string
  contractStartDate: string
}): Promise<PartnerCompany> {
  try {
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
      headers['X-Member-Id'] = token // 또는 토큰에서 추출한 사용자 ID
    }

    const response = await fetch(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(partnerInput)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `파트너사 등록에 실패했습니다: ${response.status} ${errorData?.message || ''}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('파트너사 등록 오류:', error)
    throw error
  }
}

/**
 * 파트너사 정보를 수정합니다.
 * @param id 파트너사 ID (UUID)
 * @param partnerData 수정할 파트너사 데이터
 * @returns 수정된 파트너사 정보
 */
export async function updatePartnerCompany(
  id: string,
  partnerData: Partial<Omit<PartnerCompany, 'id'>>
): Promise<PartnerCompany | null> {
  try {
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // API 문서에 맞게 요청 데이터 변환
    const requestData = {
      companyName: partnerData.companyName,
      corpCode: partnerData.corp_code,
      contractStartDate:
        partnerData.contractStartDate instanceof Date
          ? partnerData.contractStartDate.toISOString().split('T')[0]
          : partnerData.contractStartDate,
      status: partnerData.status
    }

    const response = await fetch(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(requestData)
    })

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `파트너사 정보 수정에 실패했습니다: ${response.status} ${
          errorData?.message || ''
        }`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('파트너사 수정 오류:', error)
    throw error
  }
}

/**
 * 파트너사를 삭제(비활성화)합니다.
 * @param id 파트너사 ID (UUID)
 */
export async function deletePartnerCompany(id: string): Promise<void> {
  try {
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`, {
      method: 'DELETE',
      headers
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(
        `파트너사 삭제에 실패했습니다: ${response.status} ${errorData?.message || ''}`
      )
    }
  } catch (error) {
    console.error('파트너사 삭제 오류:', error)
    throw error
  }
}

/**
 * DART 기업 코드 목록을 검색합니다.
 * @param params 검색 파라미터
 * @returns DART API 응답
 */
export async function searchCompaniesFromDart(
  params: SearchCorpParams
): Promise<DartApiResponse> {
  try {
    const url = new URL(DART_CORP_CODES_ENDPOINT)

    if (params.page !== undefined) {
      url.searchParams.append('page', params.page.toString())
    }

    if (params.pageSize !== undefined) {
      url.searchParams.append('pageSize', params.pageSize.toString())
    }

    if (params.listedOnly !== undefined) {
      url.searchParams.append('listedOnly', params.listedOnly.toString())
    }

    if (params.corpNameFilter) {
      url.searchParams.append('corpNameFilter', params.corpNameFilter)
    }

    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
      // API 키 헤더 추가
      headers['X-API-KEY'] = process.env.NEXT_PUBLIC_DART_API_KEY || ''
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(`DART 기업 검색에 실패했습니다: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('DART 기업 검색 오류:', error)
    throw error
  }
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
 * 파트너사 재무 위험 분석 정보를 가져옵니다.
 * @param corpCode DART 기업 고유 코드
 * @param partnerName 회사명 (선택사항)
 * @returns 재무 위험 분석 결과
 */
export async function fetchFinancialRiskAssessment(
  corpCode: string,
  partnerName?: string
): Promise<FinancialRiskAssessment> {
  try {
    const url = new URL(
      `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${corpCode}/financial-risk`
    )

    if (partnerName) {
      url.searchParams.append('partnerName', partnerName)
    }

    // 인증 토큰 및 기타 필요한 헤더 설정 (필요시)
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (token) {
      // headers['Authorization'] = `Bearer ${token}`; // 이 API는 인증이 필요 없는 것으로 보임
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers
    })

    if (!response.ok) {
      throw new Error(`재무 위험 정보를 가져오는데 실패했습니다: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('재무 위험 정보 조회 오류:', error)
    throw error
  }
}

/**
 * 고유한 파트너사 이름 목록을 가져옵니다.
 * @returns 파트너사 이름 목록
 */
export async function fetchUniquePartnerCompanyNames(): Promise<string[]> {
  try {
    const url = new URL(UNIQUE_PARTNER_COMPANY_NAMES_ENDPOINT)

    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(
        `파트너사 이름 목록을 가져오는 중 오류가 발생했습니다: ${response.status}`
      )
    }

    const data = await response.json()
    return data.companyNames || []
  } catch (error) {
    console.error('파트너사 이름 목록을 가져오는 중 오류:', error)
    throw error
  }
}

/**
 * 파트너사 상세 정보를 조회합니다.
 * @param partnerId 파트너사 ID
 * @returns 파트너사 상세 정보
 */
export async function fetchPartnerCompanyDetail(
  partnerId: string
): Promise<PartnerCompany> {
  try {
    const url = new URL(`${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${partnerId}`)

    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      throw new Error(
        `파트너사 상세 정보를 가져오는 중 오류가 발생했습니다: ${response.status}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('파트너사 상세 정보를 가져오는 중 오류:', error)
    throw error
  }
}
