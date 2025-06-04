import api from '@/lib/axios'
import {
  DartApiResponse,
  DartCorpInfo,
  FinancialRiskAssessment,
  PartnerCompany,
  PartnerCompanyRaw,
  PartnerCompanyResponse,
  PartnerCompanyResponseRaw,
  SearchCorpParams,
  mapPartnerCompanies
} from '@/types/IFRS/partnerCompany'

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
    // 최종 방어 로직 - 모든 가능한 에지 케이스 차단
    console.log('🔍 fetchPartnerCompanies 호출됨:', {page, pageSize, companyNameFilter})

    // 안전한 페이지 값 계산
    let safePage = 1
    let safePageSize = 10

    // page 파라미터 검증
    const pageNum = Number(page)
    if (!isNaN(pageNum) && isFinite(pageNum) && pageNum >= 1) {
      safePage = Math.floor(pageNum)
    } else {
      console.warn('⚠️ 잘못된 page 값:', page, '-> 1로 설정')
    }

    // pageSize 파라미터 검증
    const pageSizeNum = Number(pageSize)
    if (!isNaN(pageSizeNum) && isFinite(pageSizeNum) && pageSizeNum >= 1) {
      safePageSize = Math.min(100, Math.floor(pageSizeNum))
    } else {
      console.warn('⚠️ 잘못된 pageSize 값:', pageSize, '-> 10으로 설정')
    }

    // Spring Data 페이지 인덱스 계산 (0-based) - 음수 절대 불가
    const springPageIndex = Math.max(0, safePage - 1)

    console.log('✅ 최종 검증된 값:', {
      원본: {page, pageSize},
      변환됨: {safePage, safePageSize},
      SpringData인덱스: springPageIndex
    })

    const params: Record<string, string | number> = {
      page: springPageIndex,
      size: safePageSize
    }

    if (
      companyNameFilter &&
      typeof companyNameFilter === 'string' &&
      companyNameFilter.trim()
    ) {
      params.companyNameFilter = companyNameFilter.trim()
    }

    console.log('📡 API 요청 시작:', {url: '/api/v1/partners/partner-companies', params})

    const response = await api.get<unknown>('/api/v1/partners/partner-companies', {
      params
    })

    console.log('📡 API 응답 받음:', {
      status: response.status,
      headers: response.headers,
      dataType: typeof response.data,
      dataKeys:
        response.data && typeof response.data === 'object'
          ? Object.keys(response.data)
          : 'not object'
    })

    // 서버 응답 구조를 유연하게 처리
    let content: PartnerCompanyRaw[] = []
    let totalElements = 0
    let totalPages = 0
    let size = pageSize
    let number = 0
    let numberOfElements = 0
    let first = true
    let last = true
    let empty = true

    const data = response.data as unknown // 타입 안전한 unknown 사용

    // 타입 가드 함수들
    function isPageResponse(obj: unknown): obj is {
      content: unknown[]
      totalElements: number
      totalPages: number
      size: number
      number: number
      numberOfElements: number
      first: boolean
      last: boolean
      empty: boolean
    } {
      return (
        obj !== null &&
        typeof obj === 'object' &&
        'content' in obj &&
        Array.isArray((obj as {content?: unknown}).content)
      )
    }

    function isLegacyResponse(obj: unknown): obj is {
      data: unknown[]
      total?: number
      page?: number
    } {
      return (
        obj !== null &&
        typeof obj === 'object' &&
        'data' in obj &&
        Array.isArray((obj as {data?: unknown}).data)
      )
    }

    // Spring Data Page 구조인 경우
    if (isPageResponse(data)) {
      content = data.content as PartnerCompanyRaw[]
      totalElements = data.totalElements || 0
      totalPages = data.totalPages || 0
      size = data.size || pageSize
      number = data.number || 0
      numberOfElements = data.numberOfElements || content.length
      first = data.first || false
      last = data.last || false
      empty = data.empty || content.length === 0
    }
    // 기존 구조인 경우 (data 배열)
    else if (isLegacyResponse(data)) {
      content = data.data as PartnerCompanyRaw[]
      totalElements = data.total || 0
      totalPages = Math.ceil(totalElements / pageSize)
      size = pageSize
      number = (data.page || 1) - 1
      numberOfElements = content.length
      first = number === 0
      last = number >= totalPages - 1
      empty = content.length === 0
    }
    // 직접 배열인 경우
    else if (Array.isArray(data)) {
      content = data as PartnerCompanyRaw[]
      totalElements = content.length
      totalPages = 1
      size = pageSize
      number = 0
      numberOfElements = content.length
      first = true
      last = true
      empty = content.length === 0
    }
    // 예상치 못한 구조인 경우
    else {
      console.warn('예상치 못한 응답 구조:', data)
    }

    return {
      content: mapPartnerCompanies(content),
      totalElements,
      totalPages,
      size,
      number,
      numberOfElements,
      first,
      last,
      empty
    }
  } catch (error: unknown) {
    console.error('❌ 파트너사 목록을 가져오는 중 오류:', error)

    // 에러 세부 정보 로깅
    if (error && typeof error === 'object') {
      if ('response' in error) {
        const axiosError = error as {
          response?: {
            status?: number
            statusText?: string
            data?: any
            config?: {url?: string; params?: any}
          }
        }

        console.error('📡 API 응답 오류:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          url: axiosError.response?.config?.url,
          params: axiosError.response?.config?.params
        })

        // "Page index must not be less than zero" 에러 특별 처리
        if (
          axiosError.response?.data?.message?.includes(
            'Page index must not be less than zero'
          )
        ) {
          console.error('🚨 Spring Data 페이지 인덱스 오류 발생!')
          console.error('🔍 요청 파라미터 분석:', {
            원본요청: {page, pageSize, companyNameFilter}
            // 변환된파라미터: {springPageIndex, safePageSize},
            // 실제전송파라미터: params
          })
        }
      }

      if ('message' in error) {
        console.error('에러 메시지:', (error as Error).message)
      }
    }

    let errorMessage = '파트너사 목록을 가져오는 중 오류가 발생했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다. 다시 로그인해주세요.'
      } else if (axiosError.response?.status === 403) {
        errorMessage = '접근 권한이 없습니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
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
    console.log('파트너사 상세 조회 요청 ID:', id)

    const response = await api.get(`/api/v1/partners/partner-companies/${id}`)

    console.log('파트너사 상세 조회 응답:', response.data)

    return mapPartnerCompanies([response.data])[0]
  } catch (error: unknown) {
    console.error('파트너사 정보 조회 오류:', error)

    // 404 에러인 경우 null 반환
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 404) {
        return null
      }

      let errorMessage = '파트너사 정보를 가져오는데 실패했습니다.'

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }

      throw new Error(errorMessage)
    }

    throw new Error('파트너사 정보를 가져오는데 실패했습니다.')
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
  stockCode?: string
}): Promise<PartnerCompany> {
  try {
    console.log('파트너사 생성 요청 데이터:', partnerInput)

    const response = await api.post('/api/v1/partners/partner-companies', partnerInput)

    console.log('파트너사 생성 응답:', response.data)

    return mapPartnerCompanies([response.data])[0]
  } catch (error: unknown) {
    console.error('파트너사 등록 오류:', error)

    let errorMessage = '파트너사 등록에 실패했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 400) {
        errorMessage = '잘못된 요청입니다. 입력 데이터를 확인해주세요.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
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
      companyName: partnerData.corpName,
      corpCode: partnerData.corpCode,
      contractStartDate:
        partnerData.contractStartDate instanceof Date
          ? partnerData.contractStartDate.toISOString().split('T')[0]
          : partnerData.contractStartDate,
      status: partnerData.status
    }

    console.log('파트너사 수정 요청 데이터:', requestData)
    console.log('파트너사 수정 요청 ID:', id)

    const response = await api.patch(
      `/api/v1/partners/partner-companies/${id}`,
      requestData
    )

    console.log('파트너사 수정 응답:', response.data)

    return mapPartnerCompanies([response.data])[0]
  } catch (error: unknown) {
    console.error('파트너사 수정 오류:', error)

    // 상세한 에러 정보 출력
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number
          statusText?: string
          data?: any
          headers?: any
        }
        config?: {
          url?: string
          method?: string
          headers?: any
          data?: any
        }
      }

      console.error('📡 수정 API 오류 상세:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        responseData: axiosError.response?.data,
        requestUrl: axiosError.config?.url,
        requestMethod: axiosError.config?.method,
        requestHeaders: axiosError.config?.headers,
        requestData: axiosError.config?.data
      })

      if (axiosError.response?.status === 404) {
        return null
      }

      let errorMessage = '파트너사 정보 수정에 실패했습니다.'

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 400) {
        errorMessage = '잘못된 요청입니다. 입력 데이터를 확인해주세요.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.status === 403) {
        errorMessage = '접근 권한이 없습니다. 관리자에게 문의하세요.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }

      throw new Error(errorMessage)
    }

    throw new Error('파트너사 정보 수정에 실패했습니다.')
  }
}
/**
 * 파트너사를 삭제(비활성화)합니다.
 * @param id 파트너사 ID (UUID)
 */
export async function deletePartnerCompany(id: string): Promise<void> {
  try {
    console.log('파트너사 삭제 요청 ID:', id)

    await api.delete(`/api/v1/partners/partner-companies/${id}`)

    console.log('파트너사 삭제 완료')
  } catch (error: unknown) {
    console.error('파트너사 삭제 오류:', error)

    let errorMessage = '파트너사 삭제에 실패했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 404) {
        errorMessage = '삭제하려는 파트너사를 찾을 수 없습니다.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
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
    console.log('🔍 DART 검색 호출됨:', params)

    // 입력 파라미터 검증
    if (!params || typeof params !== 'object') {
      throw new Error('유효하지 않은 검색 파라미터입니다.')
    }

    // 강화된 페이지 파라미터 검증
    let validPage = 1
    let validPageSize = 10

    // page 검증
    const pageNum = Number(params.page)
    if (!isNaN(pageNum) && isFinite(pageNum) && pageNum >= 1) {
      validPage = Math.floor(pageNum)
    } else {
      console.warn('⚠️ DART 검색: 잘못된 page 값:', params.page, '-> 1로 설정')
    }

    // pageSize 검증
    const pageSizeNum = Number(params.pageSize)
    if (!isNaN(pageSizeNum) && isFinite(pageSizeNum) && pageSizeNum >= 1) {
      validPageSize = Math.min(100, Math.floor(pageSizeNum))
    } else {
      console.warn('⚠️ DART 검색: 잘못된 pageSize 값:', params.pageSize, '-> 10으로 설정')
    }

    // Spring Data 인덱스 계산 (0-based) - 음수 절대 방지
    const page = Math.max(0, validPage - 1)
    const size = validPageSize

    console.log('✅ DART 검색 검증된 값:', {
      원본: {page: params.page, pageSize: params.pageSize},
      변환됨: {validPage, validPageSize},
      SpringData인덱스: page
    })

    const requestParams: Record<string, string | number | boolean> = {
      page,
      size
    }

    // 검색어가 있을 때만 추가 - 백엔드 DTO와 동일한 파라미터명 사용
    if (params.corpNameFilter && params.corpNameFilter.trim()) {
      requestParams.corpNameFilter = params.corpNameFilter.trim()
    }

    // 상장사 필터
    if (params.listedOnly !== undefined) {
      requestParams.listedOnly = params.listedOnly
    }

    console.log('DART API 요청 파라미터:', requestParams)
    console.log('원본 파라미터:', params)

    // 기본 헤더만 사용 (API 키 제거)
    const response = await api.get<unknown>('/api/v1/dart/corp-codes', {
      params: requestParams,
      timeout: 30000 // 30초 타임아웃
    })

    console.log('DART API 응답 상태:', response.status)
    console.log('DART API 응답 데이터:', response.data)

    // 응답 데이터 구조 처리
    let dartResponse: DartApiResponse = {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: size,
      number: page,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true
    }

    const data = response.data as unknown // 타입 안전한 unknown 사용

    // DART API 응답을 위한 타입 가드 함수들
    function isDartPageResponse(obj: unknown): obj is {
      content: unknown[]
      totalElements?: number
      totalPages?: number
      size?: number
      number?: number
      numberOfElements?: number
      first?: boolean
      last?: boolean
      empty?: boolean
    } {
      return (
        obj !== null &&
        typeof obj === 'object' &&
        'content' in obj &&
        Array.isArray((obj as {content?: unknown}).content)
      )
    }

    function isDartLegacyResponse(obj: unknown): obj is {
      data: unknown[]
      total?: number
      totalPages?: number
    } {
      return (
        obj !== null &&
        typeof obj === 'object' &&
        'data' in obj &&
        Array.isArray((obj as {data?: unknown}).data)
      )
    }

    // Spring Data Page 구조인 경우
    if (data && typeof data === 'object') {
      if (isDartPageResponse(data)) {
        dartResponse = {
          content: (data.content as DartCorpInfo[]) || [],
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0,
          size: data.size || size,
          number: data.number || page,
          numberOfElements: data.numberOfElements || 0,
          first: data.first !== undefined ? data.first : true,
          last: data.last !== undefined ? data.last : true,
          empty: data.empty !== undefined ? data.empty : true
        }
      }
      // 배열이 직접 있는 경우
      else if (Array.isArray(data)) {
        dartResponse = {
          content: data as DartCorpInfo[],
          totalElements: data.length,
          totalPages: 1,
          size: size,
          number: 0,
          numberOfElements: data.length,
          first: true,
          last: true,
          empty: data.length === 0
        }
      }
      // 데이터가 다른 키에 있는 경우
      else if (isDartLegacyResponse(data)) {
        dartResponse = {
          content: data.data as DartCorpInfo[],
          totalElements: data.total || data.data.length,
          totalPages: data.totalPages || 1,
          size: size,
          number: page,
          numberOfElements: data.data.length,
          first: page === 0,
          last: true,
          empty: data.data.length === 0
        }
      }
    }

    return dartResponse
  } catch (error: unknown) {
    console.error('DART 기업 검색 오류:', error)

    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: undefined as number | undefined,
      statusText: undefined as string | undefined,
      data: undefined as unknown,
      config: undefined as {url?: string; method?: string; params?: unknown} | undefined
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          status?: number
          statusText?: string
          data?: unknown
        }
        config?: {
          url?: string
          method?: string
          params?: unknown
        }
      }

      errorDetails.status = axiosError.response?.status
      errorDetails.statusText = axiosError.response?.statusText
      errorDetails.data = axiosError.response?.data
      errorDetails.config = axiosError.config
        ? {
            url: axiosError.config.url,
            method: axiosError.config.method,
            params: axiosError.config.params
          }
        : undefined
    }

    console.error('오류 상세:', errorDetails)

    let errorMessage = 'DART 기업 검색에 실패했습니다.'

    if (errorDetails.status === 500) {
      errorMessage =
        '서버에서 DART API 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      console.error('500 에러 상세 정보:', errorDetails.data)

      // 500 에러의 경우 빈 결과를 반환하여 UI가 깨지지 않도록 함
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: params.pageSize || 10,
        number: 0,
        numberOfElements: 0,
        first: true,
        last: true,
        empty: true
      }
    } else if (errorDetails.status === 404) {
      errorMessage = 'DART API 엔드포인트를 찾을 수 없습니다.'
    } else if (errorDetails.status === 401) {
      errorMessage = '인증이 필요합니다. 로그인 상태를 확인해주세요.'
    } else if (errorDetails.status === 403) {
      errorMessage = 'DART API 접근 권한이 없습니다.'
    } else if (errorDetails.status === 400) {
      errorMessage = '잘못된 요청입니다. 검색 조건을 확인해주세요.'
    } else if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ECONNABORTED'
    ) {
      errorMessage = '요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.'
    } else if (
      errorDetails.data &&
      typeof errorDetails.data === 'object' &&
      'message' in errorDetails.data &&
      typeof errorDetails.data.message === 'string'
    ) {
      errorMessage = errorDetails.data.message
    } else if (errorDetails.message) {
      errorMessage = `요청 실패: ${errorDetails.message}`
    }

    throw new Error(errorMessage)
  }
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

    console.log('재무 위험 정보 요청 파라미터:', {corpCode, ...params})

    const response = await api.get<FinancialRiskAssessment>(
      `/api/v1/partners/partner-companies/${corpCode}/financial-risk`,
      {params}
    )

    console.log('재무 위험 정보 응답:', response.data)

    return response.data
  } catch (error: unknown) {
    console.error('재무 위험 정보 조회 오류:', error)

    let errorMessage = '재무 위험 정보를 가져오는데 실패했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 404) {
        errorMessage = '재무 위험 정보를 찾을 수 없습니다.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
  }
}

/**
 * 고유한 파트너사 이름 목록을 가져옵니다.
 * @returns 파트너사 이름 목록
 */
export async function fetchUniquePartnerCompanyNames(): Promise<string[]> {
  try {
    console.log('파트너사 이름 목록 요청')

    const response = await api.get<{companyNames: string[]}>(
      '/api/v1/partners/unique-partner-companies'
    )

    console.log('파트너사 이름 목록 응답:', response.data)

    return response.data.companyNames || []
  } catch (error: unknown) {
    console.error('파트너사 이름 목록을 가져오는 중 오류:', error)

    let errorMessage = '파트너사 이름 목록을 가져오는 중 오류가 발생했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
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
    console.log('파트너사 상세 정보 요청 ID:', partnerId)

    const response = await api.get(`/api/v1/partners/partner-companies/${partnerId}`)

    console.log('파트너사 상세 정보 응답:', response.data)

    return mapPartnerCompanies([response.data])[0]
  } catch (error: unknown) {
    console.error('파트너사 상세 정보를 가져오는 중 오류:', error)

    let errorMessage = '파트너사 상세 정보를 가져오는 중 오류가 발생했습니다.'

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {status?: number; data?: {message?: string}}
      }

      if (axiosError.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다.'
      } else if (axiosError.response?.status === 404) {
        errorMessage = '파트너사를 찾을 수 없습니다.'
      } else if (axiosError.response?.status === 401) {
        errorMessage = '인증이 필요합니다.'
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message
      }
    }

    throw new Error(errorMessage)
  }
}
