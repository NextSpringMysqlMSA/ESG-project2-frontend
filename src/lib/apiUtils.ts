import {showError, showSuccess} from '@/util/toast'
import axios, {AxiosError} from 'axios'

/**
 * API 공통 유틸리티 함수들
 *
 * API 요청 관련 공통 처리를 위한 유틸리티 함수 모음입니다.
 * 오류 처리, 성공 메시지 등을 일관되게 처리합니다.
 */

// API 오류 메시지 추출
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Axios 오류인 경우
    const axiosError = error as AxiosError<{message?: string}>

    // 서버 응답에 오류 메시지가 있는 경우
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }

    // HTTP 상태 코드에 따른 기본 메시지
    switch (axiosError.response?.status) {
      case 400:
        return '잘못된 요청입니다.'
      case 401:
        return '인증이 필요합니다.'
      case 403:
        return '권한이 없습니다.'
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.'
      case 409:
        return '데이터 충돌이 발생했습니다.'
      case 500:
        return '서버 오류가 발생했습니다.'
      default:
        return '요청을 처리하는 중 오류가 발생했습니다.'
    }
  }

  // 일반 오류인 경우
  return error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
}

// API 요청 래퍼 함수
export const apiRequest = async <T>(
  requestFn: () => Promise<T>,
  options: {
    onSuccess?: (data: T) => void
    onError?: (error: unknown) => void
    showSuccessMessage?: string | boolean
    showErrorMessage?: boolean
    throwError?: boolean
  } = {}
): Promise<T | null> => {
  const {
    onSuccess,
    onError,
    showSuccessMessage = false,
    showErrorMessage = true,
    throwError = false
  } = options

  try {
    const response = await requestFn()

    // 성공 시 메시지 표시 (설정된 경우)
    if (showSuccessMessage) {
      showSuccess(
        typeof showSuccessMessage === 'string'
          ? showSuccessMessage
          : '요청이 성공적으로 처리되었습니다.'
      )
    }

    // 성공 콜백 호출
    onSuccess?.(response)

    return response
  } catch (error) {
    // 오류 메시지 표시 (설정된 경우)
    if (showErrorMessage) {
      showError(getErrorMessage(error))
    }

    // 오류 콜백 호출
    onError?.(error)

    // 필요시 오류 다시 던지기
    if (throwError) {
      throw error
    }

    return null
  }
}

// API 요청 후 리스트 갱신하는 공통 패턴
export const apiRequestWithListRefresh = async <T, U>(
  requestFn: () => Promise<T>,
  refreshFn: () => Promise<U[]>,
  setDataFn: (data: U[]) => void,
  options: {
    successMessage?: string
    transformResponse?: (data: U[]) => U[]
    resetStatesFn?: () => void
    onComplete?: () => void
  } = {}
) => {
  const {
    successMessage,
    transformResponse = data => data,
    resetStatesFn,
    onComplete
  } = options

  let success = false

  try {
    // 주 요청 실행
    await apiRequest(requestFn, {
      showSuccessMessage: successMessage,
      throwError: true
    })

    success = true

    // 데이터 새로고침
    const updatedList = await refreshFn()
    setDataFn(transformResponse(updatedList))

    // 필요한 경우 상태 리셋
    if (resetStatesFn) {
      resetStatesFn()
    }
  } catch (error) {
    // 오류는 apiRequest에서 이미 처리됨
    console.error('Operation failed:', error)
  } finally {
    // 완료 콜백 실행
    if (onComplete) {
      onComplete()
    }

    return success
  }
}
