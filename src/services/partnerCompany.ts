import axios from 'axios'
import api from '@/lib/axios'
import {useAuthStore} from '@/stores/authStore'
import {
  DartApiResponse,
  PartnerCompany,
  PartnerCompanyResponse,
  SearchCorpParams
} from '@/types/IFRS/partnerCompany'

/**
 * 파트너사 목록을 조회합니다.... (페이지네이션 지원)
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
    const params: Record<string, string | number> = {
      page,
      pageSize
    }

    if (companyNameFilter) {
      params.companyName = companyNameFilter
    }

    console.log('파트너사 목록 요청 URL:', '/api/v1/partners/partner-companies')
    console.log('파트너사 목록 요청 파라미터:', params)

    // X-Member-Id 헤더 추가 (필수 헤더)
    const token = useAuthStore.getState().accessToken
    const headers = token ? {'X-Member-Id': token} : {}

    console.log('요청 헤더:', headers)

    const response = await api.get('/api/v1/partners/partner-companies', {
      params,
      headers
    })
    console.log('파트너사 목록 응답:', response.data)
    return response.data
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
    const response = await api.get(`/api/v1/partners/partner-companies/${id}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
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
    // X-Member-Id 헤더 추가
    const token = useAuthStore.getState().accessToken
    const headers = token ? {'X-Member-Id': token} : {}

    const response = await api.post('/api/v1/partners/partner-companies', partnerInput, {
      headers
    })
    return response.data
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

    const response = await api.patch(
      `/api/v1/partners/partner-companies/${id}`,
      requestData
    )
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
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
    await api.delete(`/api/v1/partners/partner-companies/${id}`)
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
    console.log('DART 검색 요청 파라미터:', params) // 검색 파라미터 로깅

    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: params.page,
      pageSize: params.pageSize,
      listedOnly: params.listedOnly,
      corpNameFilter: params.corpNameFilter
    }

    console.log('DART 요청 쿼리 파라미터:', queryParams) // 쿼리 파라미터 로깅

    // DART API 키 헤더 추가 (필요한 경우)
    const headers: Record<string, string> = {}
    const apiKey = process.env.NEXT_PUBLIC_DART_API_KEY
    if (apiKey) {
      headers['X-API-KEY'] = apiKey
    }

    // 백엔드 컨트롤러는 /dart/corp-codes 경로에 매핑되어 있음
    const apiUrl = '/api/v1/dart/corp-codes'
    console.log('DART API 요청 URL:', apiUrl) // API URL 로깅
    console.log('DART API 요청 baseURL:', api.defaults.baseURL) // baseURL 로깅
    console.log('DART API 요청 헤더:', headers)

    const response = await api.get(apiUrl, {
      params: queryParams,
      headers
    })

    console.log('DART API 응답 데이터:', response.data) // 응답 데이터 로깅

    // 응답 데이터 구조 상세 분석
    if (response.data) {
      console.log('DART API 응답 필드 목록:', Object.keys(response.data))
      if (
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data.length > 0
      ) {
        console.log(
          'DART API 응답 데이터 배열 첫번째 항목 필드:',
          Object.keys(response.data.data[0])
        )
      }
    }

    return response.data
  } catch (error) {
    console.error('DART 기업 검색 오류:', error)
    if (axios.isAxiosError(error) && error.response) {
      console.error('DART API 응답 상태:', error.response.status)
      console.error('DART API 응답 데이터:', error.response.data)
    }
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
    const params: Record<string, string> = {}
    if (partnerName) {
      params.partnerName = partnerName
    }

    const response = await api.get(
      `/api/v1/partners/partner-companies/${corpCode}/financial-risk`,
      {params}
    )
    return response.data
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
    const response = await api.get('/api/v1/partners/unique-partner-companies')
    return response.data.companyNames || []
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
    const response = await api.get(`/api/v1/partners/partner-companies/${partnerId}`)
    return response.data
  } catch (error) {
    console.error('파트너사 상세 정보를 가져오는 중 오류:', error)
    throw error
  }
}
