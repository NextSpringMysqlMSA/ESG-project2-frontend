'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'
import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'

export default function Meeting() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-row w-full space-x-4">
        <Calendar mode="single" selected={date} onSelect={setDate} />
        <div className="flex flex-col w-full h-full space-y-4">
          <InputBox label="회의 제목 (예: 2025년 1차 ESG 위원회)" />
          <textarea
            className="flex items-center justify-between w-full h-full px-3 py-2 text-sm bg-transparent border rounded-md shadow-sm whitespace-nowrap border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="주요 안건 및 의결 내용 입력"
          />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
