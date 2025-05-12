import {toast, ToastOptions} from 'react-hot-toast'
import React from 'react'
import {CheckCircle, AlertCircle, XCircle, Info, Loader2} from 'lucide-react'

// 기본 스타일 정의 수정
const defaultStyle: ToastOptions = {
  position: 'top-center', // 위치 유지
  duration: 3000,
  style: {
    background: '#FFFFFF',
    color: '#334155',
    padding: '0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '420px',
    overflow: 'hidden'
  },
  // 아래 속성 추가
  className: 'toast-center-animation' // 중앙 정렬 애니메이션 클래스 추가
}

// 성공 토스트 - key 속성 추가 및 애니메이션 수정
export const showSuccess = (message: string) => {
  toast.custom(
    t => {
      return (
        <div
          className={`relative ${
            t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
          }`}
          key="success-toast">
          <div
            className="flex items-center px-4 py-3 space-x-3 border rounded-lg shadow-md bg-emerald-50 text-emerald-800 border-emerald-200"
            key="toast-content">
            <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" key="icon" />
            <div className="font-medium" key="message">
              {message}
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            key="progress-bar"
            style={{
              width: t.visible ? '100%' : '0%',
              transition: 'width 3s linear'
            }}
          />
        </div>
      )
    },
    {...defaultStyle}
  )
}

// 다른 토스트 함수도 동일하게 수정 (class 추가, 애니메이션 적용)
// 아래는 예시:
export const showError = (message: string) => {
  toast.custom(
    t => (
      <div
        className={`relative ${
          t.visible ? 'animate-toast-enter' : 'animate-toast-leave'
        }`}>
        <div className="flex items-center px-4 py-3 space-x-3 text-red-800 border border-red-200 rounded-lg shadow-md bg-red-50">
          <XCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
          <div className="font-medium">{message}</div>
        </div>
        <div
          className="absolute bottom-0 left-0 h-1 bg-red-500"
          style={{
            width: t.visible ? '100%' : '0%',
            transition: 'width 3s linear'
          }}
        />
      </div>
    ),
    {...defaultStyle}
  )
}

// 다른 토스트 함수들도 동일한 패턴으로 수정

// 경고 토스트
export const showWarning = (message: string) => {
  toast.custom(
    t => (
      <div className="relative">
        <div
          className={`flex items-center space-x-3 py-3 px-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200 shadow-md ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}>
          <AlertCircle className="flex-shrink-0 w-5 h-5 text-amber-500" />
          <div className="font-medium">{message}</div>
        </div>
        {/* 프로그레스 바 추가 */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-amber-500"
          style={{
            width: t.visible ? '100%' : '0%',
            transition: 'width 3s linear'
          }}
        />
      </div>
    ),
    {...defaultStyle}
  )
}

// 정보 토스트
export const showInfo = (message: string) => {
  toast.custom(
    t => (
      <div className="relative">
        <div
          className={`flex items-center space-x-3 py-3 px-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 shadow-md ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}>
          <Info className="flex-shrink-0 w-5 h-5 text-blue-500" />
          <div className="font-medium">{message}</div>
        </div>
        {/* 프로그레스 바 추가 */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-blue-500"
          style={{
            width: t.visible ? '100%' : '0%',
            transition: 'width 3s linear'
          }}
        />
      </div>
    ),
    {...defaultStyle}
  )
}

// 로딩 토스트 (ID 반환) - 커스텀 UI로 업데이트
export const showLoading = (message: string) => {
  return toast.custom(
    t => (
      <div
        className={`flex items-center space-x-3 py-3 px-4 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 border-l-4 border-l-customG shadow-md ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}>
        <Loader2 className="flex-shrink-0 w-5 h-5 text-customG animate-spin" />
        <div className="font-medium">{message}</div>
      </div>
    ),
    {
      ...defaultStyle,
      duration: Infinity // 로딩은 무한정 표시
    }
  )
}

// 로딩 토스트 업데이트 - 커스텀 UI로 업데이트
export const updateLoading = (id: string, message: string) => {
  toast.custom(
    t => (
      <div
        className={`flex items-center space-x-3 py-3 px-4 bg-gray-50 text-gray-800 rounded-lg border border-gray-200 border-l-4 border-l-customG shadow-md ${
          t.visible ? 'animate-enter' : 'animate-leave'
        }`}>
        <Loader2 className="flex-shrink-0 w-5 h-5 text-customG animate-spin" />
        <div className="font-medium">{message}</div>
      </div>
    ),
    {
      ...defaultStyle,
      id,
      duration: Infinity
    }
  )
}

// 로딩 토스트 완료 처리 - 커스텀 UI로 업데이트
export const dismissLoading = (
  id: string,
  message: string,
  type: 'success' | 'error' = 'success'
) => {
  if (type === 'success') {
    toast.custom(
      t => (
        <div className="relative">
          <div
            className={`flex items-center space-x-3 py-3 px-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shadow-md ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}>
            <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-500" />
            <div className="font-medium">{message}</div>
          </div>
          {/* 프로그레스 바 추가 */}
          <div
            className="absolute bottom-0 left-0 h-1 bg-emerald-500"
            style={{
              width: t.visible ? '100%' : '0%',
              transition: 'width 3s linear'
            }}
          />
        </div>
      ),
      {
        ...defaultStyle,
        id
      }
    )
  } else {
    toast.custom(
      t => (
        <div className="relative">
          <div
            className={`flex items-center space-x-3 py-3 px-4 bg-red-50 text-red-800 rounded-lg border border-red-200 shadow-md ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}>
            <XCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
            <div className="font-medium">{message}</div>
          </div>
          {/* 프로그레스 바 추가 */}
          <div
            className="absolute bottom-0 left-0 h-1 bg-red-500"
            style={{
              width: t.visible ? '100%' : '0%',
              transition: 'width 3s linear'
            }}
          />
        </div>
      ),
      {
        ...defaultStyle,
        id
      }
    )
  }
}

// 간단한 hook으로도 제공
export const useToast = () => {
  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    loading: showLoading,
    updateLoading,
    dismissLoading,
    dismiss: toast.dismiss
  }
}
