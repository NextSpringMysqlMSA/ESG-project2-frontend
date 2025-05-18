'use client'

import {useState, useEffect} from 'react'
import {AlertCircle, CheckCircle} from 'lucide-react'
import {cn} from '@/lib/utils'
import {GRIModal} from '@/components/modals/module-modals'

type TextModalProps = {
  open: boolean
  title: string
  value: string
  onChange: (value: string) => void
  onClose: () => void
  onSave: (value: string) => void
  maxLength?: number
  placeholder?: string
  description?: string
}

export default function TextModal({
  open,
  title,
  value,
  onChange,
  onClose,
  onSave,
  maxLength = 2000,
  placeholder = '내용을 입력해주세요...',
  description
}: TextModalProps) {
  const [text, setText] = useState(value)
  const [charCount, setCharCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // 초기값과 글자수 설정
  useEffect(() => {
    if (open) {
      setText(value)
      setCharCount(value.length)
      setSaved(false)
      setIsSaving(false)
    }
  }, [open, value])

  // 텍스트 변경 핸들러
  const handleTextChange = (newText: string) => {
    setText(newText)
    setCharCount(newText.length)
    // 저장 표시 초기화
    if (saved) setSaved(false)
  }

  const handleSave = () => {
    if (!text.trim() || text === value) {
      onClose()
      return
    }

    setIsSaving(true)

    // 부모 컴포넌트에 텍스트 전달
    onChange(text)

    // 저장 완료 표시
    setSaved(true)

    // 저장 함수 호출 - 현재 text 값을 직접 전달
    if (typeof onSave === 'function') {
      onSave(text)
    }

    // 잠시 후 저장 상태 해제
    setTimeout(() => {
      setIsSaving(false)
    }, 800)
  }

  // 취소 핸들러
  const handleCancel = () => {
    onClose()
  }

  // 글자수 표시 색상 계산
  const getCounterColor = () => {
    const ratio = charCount / maxLength
    if (ratio > 0.9) return 'text-red-500'
    if (ratio > 0.7) return 'text-amber-500'
    return 'text-gray-500'
  }

  // // Dialog가 닫힐 때 핸들러
  // const handleDialogChange = (isOpen: boolean) => {
  //   if (!isOpen && !isSaving) {
  //     onClose()
  //   }
  // }

  // Dialog가 열려 있지 않을 때는 아무 것도 렌더링하지 않음
  if (!open) {
    return null
  }

  return (
    <GRIModal
      open={open}
      onClose={handleCancel}
      title={title}
      width="max-w-xl"
      primaryAction={{
        label: isSaving ? '저장 중...' : '저장',
        onClick: handleSave,
        disabled: isSaving || saved || !text.trim() || text === value
      }}
      secondaryAction={{
        label: '취소',
        onClick: handleCancel
      }}>
      {/* 모달 콘텐츠 */}
      <div className="flex flex-col">
        {/* 설명 */}
        {description && <div className="mb-3 text-sm text-gray-600">{description}</div>}

        {/* 텍스트 영역 */}
        <div className="relative mb-4">
          <textarea
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            className={cn(
              'w-full min-h-[250px] p-4 text-base leading-relaxed border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-customG transition-all',
              saved ? 'bg-customG/10 border-customG/30' : 'border-gray-300'
            )}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={saved || isSaving}
            autoFocus
          />

          {/* 글자 수 표시 */}
          <div
            className={cn(
              'absolute bottom-3 right-3 text-xs font-mono bg-white/90 px-2 py-1 rounded-md border',
              getCounterColor()
            )}>
            {charCount} / {maxLength}
          </div>

          {/* 저장 완료 표시 */}
          {saved && (
            <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-customG/10 animate-pulse">
              <CheckCircle className="w-12 h-12 text-customG" />
            </div>
          )}
        </div>

        {/* 가이드라인 섹션 */}
        <div className="flex items-start p-3 mb-4 space-x-2 text-sm rounded-md bg-customG/10 text-customG">
          <AlertCircle className="h-5 w-5 text-customG flex-shrink-0 mt-0.5" />
          <div>
            <p className="mb-1 font-medium">작성 가이드</p>
            <ul className="pl-1 space-y-1 list-disc list-inside">
              <li>문장은 간결하고 명확하게 작성해주세요.</li>
              <li>내용은 최대 {maxLength}자까지 입력 가능합니다.</li>
              <li>변경사항은 &apos;저장&apos; 버튼을 클릭하면 즉시 반영됩니다.</li>
            </ul>
          </div>
        </div>

        {charCount > maxLength * 0.9 && (
          <p className="text-xs text-red-500 animate-pulse">
            글자 수 제한에 거의 도달했습니다!
          </p>
        )}
      </div>
    </GRIModal>
  )
}
