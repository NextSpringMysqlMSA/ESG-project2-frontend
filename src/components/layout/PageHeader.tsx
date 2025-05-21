'use client'

import {motion} from 'framer-motion'
import {ReactNode} from 'react'
import {cn} from '@/lib/utils'

type PageHeaderProps = {
  icon?: ReactNode
  title: string
  description?: string
  gradient?: string
  iconColor?: string
  module?: 'GRI' | 'CSDD' | 'IFRS' | string
  submodule?: 'governance' | 'strategy' | 'goal' | string
  children?: ReactNode
}

/**
 * PageHeader 컴포넌트
 *
 * 모든 페이지에서 일관된 헤더 UI를 제공하는 컴포넌트입니다.
 * 아이콘, 제목, 설명 및 추가 액션 버튼을 포함할 수 있습니다.
 * 모듈(GRI, CSDD, IFRS)별로 다른 색상과 스타일을 적용합니다.
 */
export function PageHeader({
  icon,
  title,
  description,
  gradient,
  iconColor,
  module,
  submodule,
  children
}: PageHeaderProps) {
  // 모듈별 스타일 기본값 설정
  let gradientClass = gradient || 'from-blue-100 to-blue-50'
  let iconColorClass = iconColor || 'text-blue-600'

  // 모듈에 따른 스타일 자동 설정 (gradient나 iconColor가 직접 지정되지 않은 경우)
  if (!gradient && !iconColor && module) {
    if (module === 'GRI') {
      gradientClass = 'from-green-100 to-green-50'
      iconColorClass = 'text-customG'
    } else if (module === 'CSDD') {
      gradientClass = 'from-green-100 to-green-50'
      iconColorClass = 'text-customG'
    } else if (module === 'IFRS') {
      if (submodule === 'governance') {
        gradientClass = 'from-blue-100 to-blue-50'
        iconColorClass = 'text-blue-600'
      } else if (submodule === 'strategy') {
        gradientClass = 'from-purple-100 to-purple-50'
        iconColorClass = 'text-purple-600'
      } else if (submodule === 'goal') {
        gradientClass = 'from-emerald-100 to-emerald-50'
        iconColorClass = 'text-emerald-600'
      }
    }
  }
  return (
    <motion.div
      initial={{opacity: 0, y: -10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col justify-between w-full gap-4 mb-6 md:flex-row md:items-center">
      <div className="flex items-center">
        {icon && (
          <div
            className={cn('p-2 mr-3 rounded-full', `bg-gradient-to-r ${gradientClass}`)}>
            <div className={iconColorClass}>{icon}</div>
          </div>
        )}
        <div>
          <h1 className="text-2xl text-gray-800 font-gmBold">{title}</h1>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>

      {children && <div className="flex gap-2">{children}</div>}
    </motion.div>
  )
}
