'use client'

import {ReactNode} from 'react'
import {X} from 'lucide-react'
import {motion} from 'framer-motion'

type ModalContainerProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: string
  showCloseButton?: boolean
  actions?: ReactNode
}

/**
 * ModalContainer 컴포넌트
 *
 * 모달 UI를 위한 공통 컨테이너입니다.
 * 제목, 닫기 버튼, 액션 버튼 등을 포함한 일관된 모달 레이아웃을 제공합니다.
 */
export function ModalContainer({
  open,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  showCloseButton = true,
  actions
}: ModalContainerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
      {/* 백드롭 */}
      <div
        className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <motion.div
        initial={{opacity: 0, scale: 0.95}}
        animate={{opacity: 1, scale: 1}}
        exit={{opacity: 0, scale: 0.95}}
        transition={{duration: 0.2}}
        className={`relative w-full ${width} p-6 mx-4 bg-white rounded-lg shadow-lg`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 transition-colors rounded-full hover:bg-gray-100"
              aria-label="닫기">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* 컨텐츠 */}
        <div className="my-4">{children}</div>

        {/* 액션 버튼 */}
        {actions && (
          <div className="flex justify-end gap-2 pt-2 mt-6 border-t">{actions}</div>
        )}
      </motion.div>
    </div>
  )
}
