'use client'

import {useState, useEffect} from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import {Textarea} from '@/components/ui/textarea'
import DashButton from '@/components/tools/dashButton'
import {Save, X, AlertCircle, HelpCircle, CheckCircle} from 'lucide-react'
import {cn} from '@/lib/utils'

type TextModalProps = {
  open: boolean
  title: string
  value: string
  onChange: (value: string) => void
  onClose: () => void
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
  maxLength = 2000,
  placeholder = '내용을 입력해주세요...',
  description
}: TextModalProps) {
  const [text, setText] = useState(value)
  const [charCount, setCharCount] = useState(0)
  const [saved, setSaved] = useState(false)

  // 초기값과 글자수 설정
  useEffect(() => {
    if (open) {
      setText(value)
      setCharCount(value.length)
      setSaved(false)
    }
  }, [open, value])

  // 텍스트 변경 핸들러
  const handleTextChange = (newText: string) => {
    setText(newText)
    setCharCount(newText.length)
  }

  // 저장 핸들러
  const handleSave = () => {
    onChange(text)
    setSaved(true)
    setTimeout(() => {
      onClose()
    }, 800)
  }

  // 글자수 표시 색상 계산
  const getCounterColor = () => {
    const ratio = charCount / maxLength
    if (ratio > 0.9) return 'text-red-500'
    if (ratio > 0.7) return 'text-amber-500'
    return 'text-gray-500'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-0 rounded-lg shadow-lg sm:max-w-xl">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-customG" />
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          {description && (
            <DialogDescription className="mt-2 text-sm">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="relative">
          <Textarea
            className={cn(
              'min-h-[250px] p-4 text-base leading-relaxed border-2 focus-visible:ring-customG transition-all',
              saved ? 'bg-customG/10 border-customG/30' : 'bg-white'
            )}
            value={text}
            onChange={e => handleTextChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
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
        <div className="flex items-start p-3 space-x-2 text-sm rounded-md bg-customG/10 text-customG">
          <AlertCircle className="h-5 w-5 text-customG flex-shrink-0 mt-0.5" />
          <div>
            <p className="mb-1 font-medium">작성 가이드</p>
            <ul className="pl-1 space-y-1 list-disc list-inside">
              <li>문장은 간결하고 명확하게 작성해주세요.</li>
              <li>내용은 최대 {maxLength}자까지 입력 가능합니다.</li>
              <li>변경사항은 '저장' 버튼을 클릭하면 반영됩니다.</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between pt-3 border-t">
          <div className="flex-1">
            {charCount > maxLength * 0.9 && (
              <p className="text-xs text-red-500 animate-pulse">
                글자 수 제한에 거의 도달했습니다!
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <DashButton
              onClick={onClose}
              width="w-24"
              className="text-gray-800 bg-gray-100 border-gray-300 hover:bg-gray-200">
              <X className="w-4 h-4 mr-1" />
              취소
            </DashButton>
            <DashButton
              onClick={handleSave}
              width="w-24"
              className="text-white bg-customG border-customG hover:bg-white hover:text-customG hover:border-customG"
              disabled={saved}>
              <Save className="w-4 h-4 mr-1" />
              저장
            </DashButton>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
