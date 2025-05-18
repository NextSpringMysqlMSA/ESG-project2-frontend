'use client'

import {ReactNode} from 'react'
import {AlertCircle, Info} from 'lucide-react'
import {motion} from 'framer-motion'
import {Card, CardContent} from '@/components/ui/card'
import {Button} from '@/components/ui/button'

type LoadingStateProps = {
  isLoading: boolean
  error: string | null
  isEmpty?: boolean // 데이터가 없는 상태
  emptyMessage?: string
  emptyIcon?: ReactNode
  emptyAction?: {
    label: string
    href?: string
    onClick?: () => void
  }
  retryAction?: () => void
  children: ReactNode
  // 빈 상태일 때 폼을 표시할지 여부
  showFormWhenEmpty?: boolean
  // 빈 상태일 때 표시할 폼 컴포넌트
  emptyStateForm?: ReactNode
}

/**
 * LoadingState 컴포넌트
 *
 * 데이터 로딩, 오류 상태를 처리하는 컨테이너 컴포넌트입니다.
 * 각 상태에 맞는 UI를 자동으로 표시합니다.
 * 수정: 데이터가 없을 때는 기본적으로 자식 컴포넌트(폼)를 그대로 표시합니다.
 */
export function LoadingState({
  isLoading,
  error,
  isEmpty = false,
  emptyMessage = '데이터가 없습니다.',
  emptyIcon = <Info className="w-16 h-16" />,
  emptyAction,
  retryAction,
  children,
  showFormWhenEmpty = true, // 기본값을 true로 설정
  emptyStateForm
}: LoadingStateProps) {
  // 로딩 중 UI
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 mb-4 border-4 border-t-4 border-gray-100 rounded-full border-t-customG animate-spin"></div>
        <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
      </div>
    )
  }

  // 오류 UI
  if (error) {
    return (
      <Card className="border-red-100 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 mb-4 text-red-500 rounded-full bg-red-50">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-red-500">{error}</h3>
          <p className="mb-6 text-gray-500">오류가 발생했습니다.</p>
          {retryAction && (
            <Button
              onClick={retryAction}
              className="px-4 py-2 text-white bg-red-500 hover:bg-red-600">
              다시 시도
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  // 빈 상태일 때 폼을 표시할지 여부에 따라 처리
  if (isEmpty && !showFormWhenEmpty) {
    // 빈 상태 UI (기존 코드 - 이제는 선택적으로만 사용)
    return (
      <Card className="border-blue-100 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 mb-4 text-blue-500 rounded-full bg-blue-50">
            {emptyIcon}
          </div>
          <h3 className="mb-2 text-xl font-medium text-gray-700">{emptyMessage}</h3>
          {emptyAction && (
            <motion.div
              initial={{opacity: 0, y: 10}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2}}
              className="mt-4">
              <Button
                onClick={emptyAction.onClick}
                className="px-4 py-2 font-medium text-white bg-customG hover:bg-customGDark"
                asChild={!!emptyAction.href}>
                {emptyAction.href ? (
                  <a href={emptyAction.href}>{emptyAction.label}</a>
                ) : (
                  emptyAction.label
                )}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    )
  }

  // 빈 상태이지만 폼을 표시해야 하는 경우
  if (isEmpty && showFormWhenEmpty) {
    // 제공된 emptyStateForm이 있으면 표시, 없으면 일반 children 표시
    return <>{emptyStateForm || children}</>
  }

  // 데이터가 있는 정상 상태
  return <>{children}</>
}
