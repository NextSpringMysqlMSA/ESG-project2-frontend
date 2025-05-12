'use client'

import {ReactNode} from 'react'
import {Button, ButtonProps} from '@/components/ui/button'
import {cn} from '@/lib/utils'

type ModuleButtonProps = ButtonProps & {
  children: ReactNode
  module: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link'
}

/**
 * GRI 모듈용 버튼 컴포넌트
 */
// export function GRIButton({
//   children,
//   className,
//   variant = 'default',
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   const getClassName = () => {
//     if (variant === 'default') {
//       return cn('bg-customG hover:bg-customGDark text-white', className)
//     } else if (variant === 'outline') {
//       return cn('border-customG text-customG hover:bg-customG/10', className)
//     } else if (variant === 'secondary') {
//       return cn('bg-customG/20 text-customG hover:bg-customG/30', className)
//     }

//     return className
//   }

//   return (
//     <Button className={getClassName()} variant={variant} {...props}>
//       {children}
//     </Button>
//   )
// }

// /**
//  * CSDD 모듈용 버튼 컴포넌트
//  */
// export function CSDDButton({
//   children,
//   className,
//   variant = 'default',
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   const getClassName = () => {
//     if (variant === 'default') {
//       return cn('bg-customG hover:bg-customGDark text-white', className)
//     } else if (variant === 'outline') {
//       return cn('border-customG text-customG hover:bg-customG/10', className)
//     } else if (variant === 'secondary') {
//       return cn('bg-customG/20 text-customG hover:bg-customG/30', className)
//     }

//     return className
//   }

//   return (
//     <Button className={getClassName()} variant={variant} {...props}>
//       {children}
//     </Button>
//   )
// }

/**
 * IFRS 거버넌스 모듈용 버튼 컴포넌트
 */
export function IFRSGovernanceButton({
  children,
  className,
  variant = 'default',
  ...props
}: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
  const getClassName = () => {
    if (variant === 'default') {
      return cn('bg-blue-600 hover:bg-blue-700 text-white', className)
    } else if (variant === 'outline') {
      return cn('border-blue-600 text-blue-600 hover:bg-blue-600/10', className)
    } else if (variant === 'secondary') {
      return cn('bg-blue-600/20 text-blue-600 hover:bg-blue-600/30', className)
    }

    return className
  }

  return (
    <Button className={getClassName()} variant={variant} {...props}>
      {children}
    </Button>
  )
}

/**
 * IFRS 전략 모듈용 버튼 컴포넌트
 */
// export function IFRSStrategyButton({
//   children,
//   className,
//   variant = 'default',
//   ...props
// }: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
//   const getClassName = () => {
//     if (variant === 'default') {
//       return cn('bg-purple-600 hover:bg-purple-700 text-white', className)
//     } else if (variant === 'outline') {
//       return cn('border-purple-600 text-purple-600 hover:bg-purple-600/10', className)
//     } else if (variant === 'secondary') {
//       return cn('bg-purple-600/20 text-purple-600 hover:bg-purple-600/30', className)
//     }

//     return className
//   }

//   return (
//     <Button className={getClassName()} variant={variant} {...props}>
//       {children}
//     </Button>
//   )
// }

/**
 * IFRS 목표/지표 모듈용 버튼 컴포넌트
 */
export function IFRSGoalButton({
  children,
  className,
  variant = 'default',
  ...props
}: Omit<ModuleButtonProps, 'module' | 'submodule'>) {
  const getClassName = () => {
    if (variant === 'default') {
      return cn('bg-emerald-600 hover:bg-emerald-700 text-white', className)
    } else if (variant === 'outline') {
      return cn('border-emerald-600 text-emerald-600 hover:bg-emerald-600/10', className)
    } else if (variant === 'secondary') {
      return cn('bg-emerald-600/20 text-emerald-600 hover:bg-emerald-600/30', className)
    }

    return className
  }

  return (
    <Button className={getClassName()} variant={variant} {...props}>
      {children}
    </Button>
  )
}
