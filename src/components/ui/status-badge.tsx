'use client'

import {ReactNode} from 'react'
import {cn} from '@/lib/utils'
import {getSeverityClass} from '@/lib/themeUtils'

type StatusBadgeProps = {
  text: string
  icon?: ReactNode
  severity?: 'error' | 'warning' | 'success' | 'info' | 'neutral'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * StatusBadge 컴포넌트
 *
 * 텍스트 내용에 따라 자동으로 색상을 적용하는 배지 컴포넌트입니다.
 * 또는 severity 속성을 통해 직접 상태 유형을 지정할 수 있습니다.
 */
export function StatusBadge({
  text,
  icon,
  severity,
  className = '',
  size = 'md'
}: StatusBadgeProps) {
  // 크기별 클래스 정의
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-xs',
    lg: 'px-2.5 py-1.5 text-sm'
  }

  // severity가 직접 지정된 경우의 색상
  const severityClasses = {
    error: 'bg-red-50 text-red-600 border-red-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    success: 'bg-green-50 text-green-600 border-green-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    neutral: 'bg-gray-50 text-gray-600 border-gray-200'
  }

  // 지정된 severity가 있으면 사용, 없으면 텍스트 기반 자동 감지
  const colorClass = severity ? severityClasses[severity] : getSeverityClass(text)

  return (
    <span
      className={cn(
        'inline-block font-medium rounded-full border',
        sizeClasses[size],
        colorClass,
        className
      )}>
      {icon && <span className="mr-1">{icon}</span>}
      {text}
    </span>
  )
}
