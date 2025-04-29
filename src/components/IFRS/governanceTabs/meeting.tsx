'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'

export default function Meeting() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">회의관리</span>
      <Calendar mode="single" selected={date} onSelect={setDate} />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="회의 제목 (예: 2025년 1차 ESG 위원회)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="주요 안건 및 의결 내용 입력"
      />
      <button className="p-2 text-white border w-28 rounded-xl bg-customG">
        + 회의 추가
      </button>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
