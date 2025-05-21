'use client'

import {ReactNode} from 'react'
import {Button} from '@/components/ui/button'
import {ModalContainer} from '@/components/ui/modal-container'

type ModuleModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  module?: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
  width?: string
  showCloseButton?: boolean
  primaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  actions?: ReactNode
}

/**
 * GRI 모듈용 모달 컴포넌트 - 현재 사용됨 (TextModal.tsx에서 사용 중)
 */
export function GRIModal({
  open,
  onClose,
  title,
  children,
  width = 'max-w-2xl',
  showCloseButton = true,
  primaryAction,
  secondaryAction,
  actions
}: Omit<ModuleModalProps, 'module' | 'submodule'>) {
  // GRI 특화 스타일
  const renderActions = () => {
    if (actions) return actions

    return (
      <>
        {secondaryAction && (
          <Button
            variant="outline"
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className="border-gray-300 hover:bg-gray-50">
            {secondaryAction.label}
          </Button>
        )}
        {primaryAction && (
          <Button
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className="text-white bg-customG hover:bg-customG/90">
            {primaryAction.label}
          </Button>
        )}
      </>
    )
  }

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      showCloseButton={showCloseButton}
      actions={renderActions()}>
      {children}
    </ModalContainer>
  )
}
