'use client'

import {useState} from 'react'
import CustomTable from './customTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import React from 'react'

// props 타입에 data 추가 (2차원 배열 형태)
type CollapsibleWindowProps = {
  headers: string[]
  data: string[][] // 예: [["ESG 위원회", "홍길동 / 위원장 / 전략팀", "기후 대응"]]
  formContent: (props: {onClose: () => void}) => React.ReactNode

  dialogTitle?: string
}

export default function CollapsibleWindow({
  headers,
  data,
  formContent,
  dialogTitle = '항목 입력'
}: CollapsibleWindowProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <div className="flex flex-col space-y-4">
      {/* ➕ 항목 추가 버튼 및 다이얼로그 */}
      <div className="flex flex-row justify-end w-full">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-24 p-2 text-white transition-all duration-200 border bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG">
              + 항목 추가
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {/* 항목 입력 폼 */}
            {formContent({onClose: handleClose})}
          </DialogContent>
        </Dialog>
      </div>

      {/* 커스텀 테이블에 데이터 전달 */}
      <CustomTable headers={headers} data={data} />
    </div>
  )
}
