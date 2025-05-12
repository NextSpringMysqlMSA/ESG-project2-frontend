'use client'

import {ReactNode} from 'react'
import {Button, ButtonProps} from '@/components/ui/button'
import {cn} from '@/lib/utils'
// moduleColors는 사용되지 않음 - 제거

type ModuleButtonProps = ButtonProps & {
  children: ReactNode
  icon?: ReactNode
  module: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
  className?: string
}

/**
 * GRI 모듈용 버튼 컴포넌트 - 현재 직접 사용되지 않음 (동일한 이름의 컴포넌트가 module-ui/module-buttons.tsx에 있어 충돌 가능성 있음)
 *
 * GRI 모듈에 특화된 스타일이 적용된 버튼 컴포넌트입니다.
 */
// export function GRIButton({
//   children,
//   icon,
//   variant = 'default',
//   size = 'default',
//   className,
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   // GRI 모듈 특화 스타일
//   const variantClasses: Record<string, string> = {
//     default: 'bg-customG hover:bg-customG/90 text-white',
//     outline: 'border-customG/30 text-customG hover:bg-customG/10',
//     secondary: 'bg-customG/10 text-customG hover:bg-customG/20',
//     destructive: 'bg-red-500 hover:bg-red-600 text-white',
//     ghost: 'text-customG hover:bg-customG/10',
//     link: 'text-customG underline-offset-4 hover:underline'
//   }

//   return (
//     <Button
//       variant={variant}
//       size={size}
//       className={cn(
//         variant && variant !== 'destructive' && variantClasses[variant as string],
//         'flex items-center gap-1.5',
//         className
//       )}
//       {...props}>
//       {icon && <span className="mr-1">{icon}</span>}
//       {children}
//     </Button>
//   )
// }

// /**
//  * CSDD 모듈용 버튼 컴포넌트 - 현재 직접 사용되지 않음
//  *
//  * CSDD 모듈에 특화된 스타일이 적용된 버튼 컴포넌트입니다.
//  */
// export function CSDDButton({
//   children,
//   icon,
//   variant = 'default',
//   size = 'default',
//   className,
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   // CSDD 모듈 특화 스타일 (GRI와 동일한 색상 사용)
//   const variantClasses: Record<string, string> = {
//     default: 'bg-customG hover:bg-customG/90 text-white',
//     outline: 'border-customG/30 text-customG hover:bg-customG/10',
//     secondary: 'bg-customG/10 text-customG hover:bg-customG/20',
//     destructive: 'bg-red-500 hover:bg-red-600 text-white',
//     ghost: 'text-customG hover:bg-customG/10',
//     link: 'text-customG underline-offset-4 hover:underline'
//   }

//   return (
//     <Button
//       variant={variant}
//       size={size}
//       className={cn(
//         variant && variant !== 'destructive' && variantClasses[variant as string],
//         'flex items-center gap-1.5',
//         className
//       )}
//       {...props}>
//       {icon && <span className="mr-1">{icon}</span>}
//       {children}
//     </Button>
//   )
// }

/**
 * IFRS 거버넌스 모듈용 버튼 컴포넌트 - 현재 사용됨 (committee.tsx에서 사용 중)
 *
 * IFRS 거버넌스 모듈에 특화된 스타일이 적용된 버튼 컴포넌트입니다.
 */
export function IFRSGovernanceButton({
  children,
  icon,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
  // 거버넌스 특화 스타일 (파란색 계열)
  const variantClasses: Record<string, string> = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border-blue-500/30 text-blue-600 hover:bg-blue-50',
    secondary: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'text-blue-600 hover:bg-blue-50',
    link: 'text-blue-600 underline-offset-4 hover:underline'
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        variant && variant !== 'destructive' && variantClasses[variant as string],
        'flex items-center gap-1.5',
        className
      )}
      {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </Button>
  )
}

/**
 * IFRS 전략 모듈용 버튼 컴포넌트 - 현재 직접 사용되지 않음
 *
 * IFRS 전략 모듈에 특화된 스타일이 적용된 버튼 컴포넌트입니다.
 */
// export function IFRSStrategyButton({
//   children,
//   icon,
//   variant = 'default',
//   size = 'default',
//   className,
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   // 전략 특화 스타일 (보라색 계열)
//   const variantClasses: Record<string, string> = {
//     default: 'bg-purple-600 hover:bg-purple-700 text-white',
//     outline: 'border-purple-500/30 text-purple-600 hover:bg-purple-50',
//     secondary: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
//     destructive: 'bg-red-500 hover:bg-red-600 text-white',
//     ghost: 'text-purple-600 hover:bg-purple-50',
//     link: 'text-purple-600 underline-offset-4 hover:underline'
//   }

//   return (
//     <Button
//       variant={variant}
//       size={size}
//       className={cn(
//         variant && variant !== 'destructive' && variantClasses[variant as string],
//         'flex items-center gap-1.5',
//         className
//       )}
//       {...props}>
//       {icon && <span className="mr-1">{icon}</span>}
//       {children}
//     </Button>
//   )
// }

/**
 * IFRS 목표/지표 모듈용 버튼 컴포넌트 - 현재 사용됨 (kpiGoal.tsx에서 사용 중)
 *
 * IFRS 목표/지표 모듈에 특화된 스타일이 적용된 버튼 컴포넌트입니다.
 */
export function IFRSGoalButton({
  children,
  icon,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
  // 목표/지표 특화 스타일 (초록색 계열)
  const variantClasses: Record<string, string> = {
    default: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    outline: 'border-emerald-500/30 text-emerald-600 hover:bg-emerald-50',
    secondary: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
    destructive: 'bg-red-500 hover:bg-red-600 text-white',
    ghost: 'text-emerald-600 hover:bg-emerald-50',
    link: 'text-emerald-600 underline-offset-4 hover:underline'
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        variant && variant !== 'destructive' && variantClasses[variant as string],
        'flex items-center gap-1.5',
        className
      )}
      {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </Button>
  )
}
