'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'

export default function Meeting() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col h-full mt-8 space-y-4">
      <span>회의관리</span>
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="회의 제목 (예: 2025년 1차 ESG 위원회)"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="주요 안건 및 의결 내용 입력"
      />
      <button className="p-2 text-white border w-28 rounded-xl bg-customG">
        + 회의 추가
      </button>
    </div>
  )
}
