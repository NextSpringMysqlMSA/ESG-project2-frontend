'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'
import DashButton from '@/components/dashButton'
import InputBox from '@/components/inputBox'

export default function Meeting() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">회의관리</span>
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <InputBox placeholder="회의 제목 (예: 2025년 1차 ESG 위원회)" />
      <InputBox placeholder="주요 안건 및 의결 내용 입력" />
      <DashButton width="w-24">+ 회의 추가</DashButton>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
