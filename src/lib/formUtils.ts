import {ChangeEvent} from 'react'

/**
 * 폼 필드 검증 및 공통 폼 로직을 위한 유틸리티 함수 모음
 */

// 텍스트 필드 값 검증
export const validateTextField = (
  value: string,
  options: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    errorMessages?: {
      required?: string
      minLength?: string
      maxLength?: string
      pattern?: string
    }
  } = {}
) => {
  const {required = false, minLength, maxLength, pattern, errorMessages = {}} = options

  if (required && (!value || value.trim() === '')) {
    return errorMessages.required || '이 필드는 필수입니다.'
  }

  if (minLength && value.length < minLength) {
    return errorMessages.minLength || `최소 ${minLength}자 이상 입력해주세요.`
  }

  if (maxLength && value.length > maxLength) {
    return errorMessages.maxLength || `최대 ${maxLength}자까지 입력 가능합니다.`
  }

  if (pattern && !pattern.test(value)) {
    return errorMessages.pattern || '올바른 형식이 아닙니다.'
  }

  return null // 유효한 경우 null 반환
}

// 숫자 필드 값 검증
export const validateNumberField = (
  value: string | number,
  options: {
    required?: boolean
    min?: number
    max?: number
    integer?: boolean
    errorMessages?: {
      required?: string
      min?: string
      max?: string
      integer?: string
      notNumber?: string
    }
  } = {}
) => {
  const {required = false, min, max, integer = false, errorMessages = {}} = options

  const numValue = typeof value === 'string' ? Number(value) : value

  if (required && (value === '' || value === null || value === undefined)) {
    return errorMessages.required || '이 필드는 필수입니다.'
  }

  if (value !== '' && isNaN(numValue)) {
    return errorMessages.notNumber || '유효한 숫자를 입력해주세요.'
  }

  if (min !== undefined && numValue < min) {
    return errorMessages.min || `${min} 이상의 값을 입력해주세요.`
  }

  if (max !== undefined && numValue > max) {
    return errorMessages.max || `${max} 이하의 값을 입력해주세요.`
  }

  if (integer && !Number.isInteger(numValue)) {
    return errorMessages.integer || '정수를 입력해주세요.'
  }

  return null // 유효한 경우 null 반환
}

// 폼 필드 변경 핸들러 생성기
export const createChangeHandler = <T extends Record<string, any>>(
  setter: (field: keyof T, value: any) => void
) => {
  return (field: keyof T) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setter(field, e.target.value)
    }
}

// 폼 필드 숫자 변경 핸들러 생성기
export const createNumberChangeHandler = <T extends Record<string, any>>(
  setter: (field: keyof T, value: any) => void
) => {
  return (field: keyof T) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      setter(field, '')
    } else {
      setter(field, Number(value))
    }
  }
}

// 폼 검증 상태 초기화
export const initializeFormErrors = <T extends Record<string, any>>(
  fields: Array<keyof T>
): Record<keyof T, string | null> => {
  return fields.reduce((acc, field) => {
    acc[field] = null
    return acc
  }, {} as Record<keyof T, string | null>)
}
