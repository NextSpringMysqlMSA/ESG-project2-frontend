import {useAuthStore} from '@/stores/authStore'
import api from '@/lib/axios'

/**
 * 파트너사(협력사) 정보 타입
 */
export interface PartnerCompany {
  id?: string // 파트너사 고유 ID
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' // 파트너사 상태
  industry?: string // 산업군
  country?: string // 국가
  address?: string // 주소
  corpCode: string // DART corpCode (기존 corp_code)
  companyName: string // 회사명 (API 응답 필드 및 프론트엔드에서 사용, 기존 corp_name과 companyName 통합)
  stockCode?: string // 주식 코드 (기존 stock_code)
  contractStartDate?: string | Date // 계약 시작일 (API 응답 필드 - YYYY-MM-DD 문자열 또는 Date 객체)
  modifyDate?: string // 수정일 (기존 modify_date)
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
  corpCode: string // 기업 고유 코드 (기존 corp_code)
  companyName: string // 기업명 (기존 corp_name)
  stockCode?: string // 주식 코드 (상장사만 존재, 기존 stock_code)
  modifyDate: string // 최종 수정일 (기존 modify_date)
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
  console.log(
    `[fetchPartnerCompanies] 호출: page=${page}, pageSize=${pageSize}, companyNameFilter=${
      companyNameFilter || '없음'
    }`
  )
  try {
    const params: Record<string, any> = {
      page,
      pageSize
    }

    if (companyNameFilter) {
      params.companyName = companyNameFilter
    }

    const response = await api.get('/api/v1/partners/partner-companies', {params})
    console.log(`[fetchPartnerCompanies] 성공: ${response.data.data.length}개 항목 반환`)
    return response.data
  } catch (error) {
    console.error('[fetchPartnerCompanies] 파트너사 목록을 가져오는 중 오류:', error)
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
  console.log(`[fetchPartnerCompanyById] 호출: id=${id}`)
  try {
    const response = await api.get(`/api/v1/partners/partner-companies/${id}`)
    console.log(`[fetchPartnerCompanyById] 성공: 파트너사 ID=${id} 정보 반환`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log(`[fetchPartnerCompanyById] 파트너사 ID=${id} 찾을 수 없음`)
      return null
    }
    console.error('[fetchPartnerCompanyById] 파트너사 정보 조회 오류:', error)
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
  console.log(
    `[createPartnerCompany] 호출: companyName=${partnerInput.companyName}, corpCode=${partnerInput.corpCode}`
  )
  try {
    // 회원 ID 헤더 추가 (필요시)
    const token = useAuthStore.getState().accessToken
    const headers: Record<string, string> = {}

    if (token) {
      headers['X-MEMBER-ID'] = token
      console.log('[createPartnerCompany] X-MEMBER-ID 토큰 추가됨')
    }

    const response = await api.post('/api/v1/partners/partner-companies', partnerInput, {
      headers
    })
    console.log(`[createPartnerCompany] 성공: 파트너사 ID=${response.data.id} 생성됨`)
    return response.data
  } catch (error) {
    console.error('[createPartnerCompany] 파트너사 등록 오류:', error)
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
  partnerData: Partial<{
    companyName: string
    corpCode: string
    contractStartDate: string | Date
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  }>
): Promise<PartnerCompany | null> {
  console.log(`[updatePartnerCompany] 호출: id=${id}, data=`, partnerData)
  try {
    // API 문서에 맞게 요청 데이터 변환
    const requestData = {
      companyName: partnerData.companyName,
      corpCode: partnerData.corpCode,
      contractStartDate:
        partnerData.contractStartDate instanceof Date
          ? partnerData.contractStartDate.toISOString().split('T')[0]
          : partnerData.contractStartDate,
      status: partnerData.status
    }

    const response = await api.patch(
      `/api/v1/partners/partner-companies/${id}`,
      requestData
    )
    console.log(`[updatePartnerCompany] 성공: 파트너사 ID=${id} 업데이트됨`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log(`[updatePartnerCompany] 파트너사 ID=${id} 찾을 수 없음`)
      return null
    }
    console.error('[updatePartnerCompany] 파트너사 수정 오류:', error)
    throw error
  }
}

/**
 * 파트너사를 삭제(비활성화)합니다.
 * @param id 파트너사 ID (UUID)
 */
export async function deletePartnerCompany(id: string): Promise<void> {
  console.log(`[deletePartnerCompany] 호출: id=${id}`)
  try {
    await api.delete(`/api/v1/partners/partner-companies/${id}`)
    console.log(`[deletePartnerCompany] 성공: 파트너사 ID=${id} 삭제됨`)
  } catch (error) {
    console.error('[deletePartnerCompany] 파트너사 삭제 오류:', error)
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
  console.log(`[searchCompaniesFromDart] 호출: params=`, params)
  try {
    // DART API 키 헤더 추가 (필요한 경우)
    const headers: Record<string, string> = {}
    const dartApiKey = process.env.NEXT_PUBLIC_DART_API_KEY
    if (dartApiKey) {
      headers['X-API-KEY'] = dartApiKey
      console.log('[searchCompaniesFromDart] X-API-KEY 추가됨')
    }

    const response = await api.get('/api/v1/dart/corp-codes', {
      params,
      headers
    })

    // 서버 응답이 아직 snake_case를 사용하는 경우 camelCase로 변환
    if (response.data && response.data.data) {
      console.log(
        `[searchCompaniesFromDart] 원본 결과: ${response.data.data.length}개 회사 찾음`
      )
      response.data.data = response.data.data.map((company: any) => ({
        corpCode: company.corpCode || company.corp_code,
        companyName: company.companyName || company.corp_name,
        stockCode: company.stockCode || company.stock_code,
        modifyDate: company.modifyDate || company.modify_date
      }))
    }

    console.log(
      `[searchCompaniesFromDart] 성공: ${
        response.data.data?.length || 0
      }개 회사 반환, 페이지=${response.data.page || 1}/${response.data.totalPages || 1}`
    )
    return response.data
  } catch (error) {
    console.error('[searchCompaniesFromDart] DART 기업 검색 오류:', error)
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
  console.log(
    `[fetchFinancialRiskAssessment] 호출: corpCode=${corpCode}, partnerName=${
      partnerName || '없음'
    }`
  )
  try {
    const params: Record<string, string> = {}

    if (partnerName) {
      params.partnerName = partnerName
    }

    const response = await api.get(
      `/api/v1/partners/partner-companies/${corpCode}/financial-risk`,
      {
        params
      }
    )

    console.log(
      `[fetchFinancialRiskAssessment] 성공: ${
        response.data.riskItems?.length || 0
      }개 위험 항목 발견`
    )
    return response.data
  } catch (error) {
    console.error('[fetchFinancialRiskAssessment] 재무 위험 정보 조회 오류:', error)
    throw error
  }
}

/**
 * 고유한 파트너사 이름 목록을 가져옵니다.
 * @returns 파트너사 이름 목록
 */
export async function fetchUniquePartnerCompanyNames(): Promise<string[]> {
  console.log('[fetchUniquePartnerCompanyNames] 호출')
  try {
    const response = await api.get('/api/v1/partners/unique-partner-companies')
    console.log(
      `[fetchUniquePartnerCompanyNames] 성공: ${
        response.data.companyNames?.length || 0
      }개 회사명 반환`
    )
    return response.data.companyNames || []
  } catch (error) {
    console.error(
      '[fetchUniquePartnerCompanyNames] 파트너사 이름 목록을 가져오는 중 오류:',
      error
    )
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
  console.log(`[fetchPartnerCompanyDetail] 호출: partnerId=${partnerId}`)
  try {
    const response = await api.get(`/api/v1/partners/partner-companies/${partnerId}`)
    console.log(
      `[fetchPartnerCompanyDetail] 성공: 파트너사 ID=${partnerId} 상세 정보 반환`
    )
    return response.data
  } catch (error) {
    console.error(
      '[fetchPartnerCompanyDetail] 파트너사 상세 정보를 가져오는 중 오류:',
      error
    )
    throw error
  }
}
