'use client'

import {ReactNode} from 'react'
import {DataTable} from '@/components/ui/data-table'
import {SectionHeader} from '@/components/layout/SectionHeader'
import {moduleColors} from '@/lib/themeUtils'

type ModuleTableProps = {
  headers: string[]
  data: Array<Array<string | ReactNode>>
  title: string
  description?: string
  icon?: ReactNode
  module: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
  badges?: Array<{
    icon?: ReactNode
    text: string
    className?: string
  }>
  onRowClick?: (rowIndex: number) => void
  emptyMessage?: string
  className?: string
  tableClassName?: string
  striped?: boolean
  compact?: boolean
  hoverable?: boolean
  actions?: ReactNode
}

/**
 * GRITable 컴포넌트
 *
 * GRI 모듈에 특화된 스타일이 적용된 데이터 테이블 컴포넌트입니다.
 */
export function GRITable({
  headers,
  data,
  title,
  description,
  icon,
  badges,
  onRowClick,
  emptyMessage,
  className,
  tableClassName,
  striped = true,
  compact = false,
  hoverable = true,
  actions
}: Omit<ModuleTableProps, 'module' | 'submodule'>) {
  return (
    <div className={className}>
      <SectionHeader icon={icon} title={title} description={description} badges={badges}>
        {actions}
      </SectionHeader>

      <DataTable
        headers={headers}
        data={data}
        className={tableClassName}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        striped={striped}
        compact={compact}
        hoverable={hoverable}
      />
    </div>
  )
}

/**
 * CSDDTable 컴포넌트
 *
 * CSDD 모듈에 특화된 스타일이 적용된 데이터 테이블 컴포넌트입니다.
 */
export function CSDDTable({
  headers,
  data,
  title,
  description,
  icon,
  badges,
  onRowClick,
  emptyMessage,
  className,
  tableClassName,
  striped = true,
  compact = false,
  hoverable = true,
  actions
}: Omit<ModuleTableProps, 'module' | 'submodule'>) {
  return (
    <div className={className}>
      <SectionHeader icon={icon} title={title} description={description} badges={badges}>
        {actions}
      </SectionHeader>

      <DataTable
        headers={headers}
        data={data}
        className={tableClassName}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        striped={striped}
        compact={compact}
        hoverable={hoverable}
      />
    </div>
  )
}

/**
 * IFRSGovernanceTable 컴포넌트
 *
 * IFRS 거버넌스 모듈에 특화된 스타일이 적용된 데이터 테이블 컴포넌트입니다.
 */
export function IFRSGovernanceTable({
  headers,
  data,
  title,
  description,
  icon,
  badges,
  onRowClick,
  emptyMessage,
  className,
  tableClassName,
  striped = true,
  compact = false,
  hoverable = true,
  actions
}: Omit<ModuleTableProps, 'module' | 'submodule'>) {
  // 거버넌스 특화 스타일 적용
  const governanceBadges = [
    ...(badges || []),
    {
      text: 'IFRS 거버넌스',
      className: 'bg-blue-50 text-blue-600 border-blue-100 pl-1.5'
    }
  ]

  return (
    <div className={className}>
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
        badges={governanceBadges}>
        {actions}
      </SectionHeader>

      <DataTable
        headers={headers}
        data={data}
        className={tableClassName}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        striped={striped}
        compact={compact}
        hoverable={hoverable}
      />
    </div>
  )
}

/**
 * IFRSStrategyTable 컴포넌트
 *
 * IFRS 전략 모듈에 특화된 스타일이 적용된 데이터 테이블 컴포넌트입니다.
 */
export function IFRSStrategyTable({
  headers,
  data,
  title,
  description,
  icon,
  badges,
  onRowClick,
  emptyMessage,
  className,
  tableClassName,
  striped = true,
  compact = false,
  hoverable = true,
  actions
}: Omit<ModuleTableProps, 'module' | 'submodule'>) {
  // 전략 특화 스타일 적용
  const strategyBadges = [
    ...(badges || []),
    {
      text: 'IFRS 전략',
      className: 'bg-purple-50 text-purple-600 border-purple-100 pl-1.5'
    }
  ]

  return (
    <div className={className}>
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
        badges={strategyBadges}>
        {actions}
      </SectionHeader>

      <DataTable
        headers={headers}
        data={data}
        className={tableClassName}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        striped={striped}
        compact={compact}
        hoverable={hoverable}
      />
    </div>
  )
}

/**
 * IFRSGoalTable 컴포넌트
 *
 * IFRS 목표/지표 모듈에 특화된 스타일이 적용된 데이터 테이블 컴포넌트입니다.
 */
export function IFRSGoalTable({
  headers,
  data,
  title,
  description,
  icon,
  badges,
  onRowClick,
  emptyMessage,
  className,
  tableClassName,
  striped = true,
  compact = false,
  hoverable = true,
  actions
}: Omit<ModuleTableProps, 'module' | 'submodule'>) {
  // 목표/지표 특화 스타일 적용
  const goalBadges = [
    ...(badges || []),
    {
      text: 'IFRS 목표/지표',
      className: 'bg-emerald-50 text-emerald-600 border-emerald-100 pl-1.5'
    }
  ]

  return (
    <div className={className}>
      <SectionHeader
        icon={icon}
        title={title}
        description={description}
        badges={goalBadges}>
        {actions}
      </SectionHeader>

      <DataTable
        headers={headers}
        data={data}
        className={tableClassName}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
        striped={striped}
        compact={compact}
        hoverable={hoverable}
      />
    </div>
  )
}
