import {useAuthStore} from '@/stores/authStore'
import {
  DartApiResponse,
  PartnerCompany,
  PartnerCompanyResponse,
  SearchCorpParams
} from '@/types/IFRS/partnerCompany'

// API 기본 URL
const API_BASE_URL = process.env.NEXT_DART_API_URL || '/api' // 환경 변수 또는 기본값 사용

// 파트너사 API 엔드포인트 - API_BASE_URL에 이미 /api가 포함될 수 있으므로 중복 방지
const API_V1_PREFIX = API_BASE_URL.endsWith('/api') ? '/v1' : '/api/v1'
const PARTNER_COMPANIES_BASE_PATH = `${API_V1_PREFIX}/partners/partner-companies`
const UNIQUE_PARTNER_COMPANY_NAMES_ENDPOINT = `${API_BASE_URL}${API_V1_PREFIX}/partners/unique-partner-companies`
const DART_CORP_CODES_ENDPOINT = `${API_BASE_URL}${API_V1_PREFIX}/dart/corp-codes`

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
    // URL이 상대 경로인 경우 절대 경로로 변환
    let apiUrl = `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}`
    if (apiUrl.startsWith('/')) {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
      apiUrl = new URL(apiUrl, baseUrl).toString()
    }

    const url = new URL(apiUrl)
    url.searchParams.append('page', page.toString())
    url.searchParams.append('pageSize', pageSize.toString())

    if (companyNameFilter) {
      url.searchParams.append('companyName', companyNameFilter)
    }

    // 인증 토큰 가져오기 및 토큰 형식 검증
    const token = useAuthStore.getState().accessToken
    // 저장된 토큰이 이미 'Bearer '로 시작하는지 확인
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (authToken) {
      headers.Authorization = authToken
      console.log('인증 토큰 확인:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
    }

    console.log('API 요청 URL:', url.toString())
    console.log('API 요청 헤더:', JSON.stringify(headers, null, 2))

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      credentials: 'include' // 쿠키 포함 (필요한 경우)
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '응답 텍스트를 가져올 수 없음')
      console.error('API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorMessage = `파트너사 목록을 가져오는 중 오류가 발생했습니다: ${response.status}`

      // 401 오류 발생 시 토큰 관련 문제일 가능성이 높음
      if (response.status === 401) {
        errorMessage +=
          ' - 인증 오류가 발생했습니다. 로그인이 필요하거나 세션이 만료되었을 수 있습니다.'
      } else if (errorText) {
        errorMessage += ` - ${errorText}`
      }

      throw new Error(errorMessage)
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
    // URL이 상대 경로인 경우 절대 경로로 변환
    let apiUrl = `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`
    if (apiUrl.startsWith('/')) {
      const baseUrl =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
      apiUrl = new URL(apiUrl, baseUrl).toString()
    }

    // 인증 토큰 가져오기 및 토큰 형식 검증
    const token = useAuthStore.getState().accessToken
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (authToken) {
      headers.Authorization = authToken
      console.log('파트너사 상세 조회 요청 인증:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
    }

    console.log('파트너사 상세 조회 요청 URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      credentials: 'include'
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

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    if (authToken) {
      headers.Authorization = authToken
      // 토큰에서 사용자 ID 추출 (필요한 경우)
      // headers['X-Member-Id'] = extractMemberId(token)
      console.log('파트너사 생성 요청 인증:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
    }

    const apiUrl = `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}`
    console.log('파트너사 생성 요청 URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      credentials: 'include',
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

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    if (authToken) {
      headers.Authorization = authToken
      console.log('파트너사 수정 요청 인증:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
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

    const apiUrl = `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`
    console.log('파트너사 수정 요청 URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers,
      credentials: 'include',
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

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    if (authToken) {
      headers.Authorization = authToken
      console.log('파트너사 삭제 요청 인증:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
    }

    const apiUrl = `${API_BASE_URL}${PARTNER_COMPANIES_BASE_PATH}/${id}`
    console.log('파트너사 삭제 요청 URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers,
      credentials: 'include'
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
    // 상대 경로를 절대 URL로 변환
    let apiUrl = DART_CORP_CODES_ENDPOINT

    // 이미 http로 시작하는 절대 URL인지 확인
    if (!apiUrl.startsWith('http') && typeof window !== 'undefined') {
      const baseUrl = window.location.origin
      apiUrl = new URL(apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`, baseUrl).toString()
    } else if (!apiUrl.startsWith('http')) {
      // 서버 사이드에서 실행될 때는 기본 URL 사용
      apiUrl = `http://localhost${apiUrl.startsWith('/') ? apiUrl : `/${apiUrl}`}`
    }

    console.log('DART API 엔드포인트:', apiUrl)
    const url = new URL(apiUrl)

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

    // 인증 토큰 가져오기 및 토큰 형식 검증
    const token = useAuthStore.getState().accessToken
    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    // DART API 키는 항상 헤더에 추가
    const dartApiKey = process.env.NEXT_PUBLIC_DART_API_KEY || ''
    if (dartApiKey) {
      headers['X-API-KEY'] = dartApiKey
    }

    // 인증 토큰이 있으면 추가
    if (authToken) {
      headers.Authorization = authToken
    }

    console.log('DART API 요청 URL:', url.toString())
    console.log('DART API 요청 헤더:', JSON.stringify(headers, null, 2))

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '응답 텍스트를 가져올 수 없음')
      console.error('DART API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })

      let errorMessage = `DART 기업 검색에 실패했습니다: ${response.status}`

      // 401 오류 발생 시 토큰 관련 문제일 가능성이 높음
      if (response.status === 401) {
        errorMessage +=
          ' - 인증 오류가 발생했습니다. 로그인이 필요하거나 세션이 만료되었을 수 있습니다.'
      } else if (errorText) {
        errorMessage += ` - ${errorText}`
      }

      throw new Error(errorMessage)
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

    // 인증 토큰 및 기타 필요한 헤더 설정
    const token = useAuthStore.getState().accessToken
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    // 서버 문서에 따라 이 API가 인증이 필요한지 여부 확인
    if (authToken) {
      headers.Authorization = authToken
      console.log('재무 위험 정보 요청 인증:', authToken.substring(0, 15) + '...')
    }

    console.log('재무 위험 정보 요청 URL:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      credentials: 'include'
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

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    if (authToken) {
      headers.Authorization = authToken
      console.log('파트너사 이름 목록 요청 인증:', authToken.substring(0, 15) + '...')
    }

    console.log('파트너사 이름 목록 요청 URL:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      credentials: 'include'
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

    // Bearer 접두어가 이미 포함되어 있는지 확인하여 중복 방지
    const authToken = token
      ? token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
      : null

    if (authToken) {
      headers.Authorization = authToken
      console.log('파트너사 상세 정보 요청 인증:', authToken.substring(0, 15) + '...')
    } else {
      console.warn('인증 토큰이 없습니다. 401 오류가 발생할 수 있습니다.')
    }

    console.log('파트너사 상세 정보 요청 URL:', url.toString())

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
      credentials: 'include'
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
