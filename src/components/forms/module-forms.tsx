'use client'

import {ReactNode} from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {motion} from 'framer-motion'
import {cn} from '@/lib/utils'

type ModuleFormCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  actions?: ReactNode
  module: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
}

/**
 * GRI 모듈용 폼 카드 컴포넌트
 */
export function GRIFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-customG/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-customG/10">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center">
                {icon && <div className="mr-2 text-customG">{icon}</div>}
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {description && (
                <CardDescription className="mt-1 text-sm">{description}</CardDescription>
              )}
            </div>

            {actions && <div className="flex gap-2 mt-2 md:mt-0">{actions}</div>}
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * CSDD 모듈용 폼 카드 컴포넌트
 */
export function CSDDFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-customG/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-customG/10">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center">
                {icon && <div className="mr-2 text-customG">{icon}</div>}
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {description && (
                <CardDescription className="mt-1 text-sm">{description}</CardDescription>
              )}
            </div>

            {actions && <div className="flex gap-2 mt-2 md:mt-0">{actions}</div>}
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * IFRS 거버넌스 모듈용 폼 카드 컴포넌트
 */
export function IFRSGovernanceFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-blue-500/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-blue-500/10">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center">
                {icon && <div className="mr-2 text-blue-600">{icon}</div>}
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {description && (
                <CardDescription className="mt-1 text-sm">{description}</CardDescription>
              )}
            </div>

            {actions && <div className="flex gap-2 mt-2 md:mt-0">{actions}</div>}
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * IFRS 전략 모듈용 폼 카드 컴포넌트
 */
export function IFRSStrategyFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-purple-500/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-purple-500/10">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center">
                {icon && <div className="mr-2 text-purple-600">{icon}</div>}
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {description && (
                <CardDescription className="mt-1 text-sm">{description}</CardDescription>
              )}
            </div>

            {actions && <div className="flex gap-2 mt-2 md:mt-0">{actions}</div>}
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * IFRS 목표/지표 모듈용 폼 카드 컴포넌트
 */
export function IFRSGoalFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-emerald-500/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-emerald-500/10">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <div className="flex items-center">
                {icon && <div className="mr-2 text-emerald-600">{icon}</div>}
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </div>
              {description && (
                <CardDescription className="mt-1 text-sm">{description}</CardDescription>
              )}
            </div>

            {actions && <div className="flex gap-2 mt-2 md:mt-0">{actions}</div>}
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>
      </Card>
    </motion.div>
  )
}
