'use client'

import {useState} from 'react'
import GriTable from '@/components/tools/griTable'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Info, BookOpen, LucideClipboardList} from 'lucide-react'

export default function GRI3() {
  const headers = ['Topic', 'No.', '지표명', '내용']

  const rows = [
    [{value: '중대 토픽 공시', rowSpan: 3}, '3-1', '중요 이슈를 결정하는 프로세스', ''],
    ['3-2', '중요 이슈 목록', ''],
    ['3-3', '중요 이슈 관리', '']
  ]

  return (
    <div className="flex flex-col w-full h-full px-1 space-y-6">
      {/* 헤더 섹션 */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-customG/10 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-customG" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              GRI 3: 일반 표준
            </CardTitle>
          </div>
          <p className="mt-2 text-gray-600">
            중요 주제 공시 항목으로, 조직이 중요한 지속가능성 이슈를 식별하고 관리하는
            방법을 공시합니다.
          </p>
        </CardHeader>
      </Card>

      {/* 간소화된 정보 섹션 */}
      <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
        <div className="text-sm">
          <span className="font-medium text-customG">
            <LucideClipboardList className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />
            전체 항목
          </span>
          <span className="ml-2 text-xs text-gray-500">{rows.length}개 지표</span>
        </div>

        {/* 범례 */}
        <div className="flex items-center text-xs text-gray-500">
          <Info className="h-3.5 w-3.5 text-customG mr-1" />
          <span>내용란을 클릭하여 정보 입력</span>
        </div>
      </div>

      {/* 테이블 */}
      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <GriTable headers={headers} rows={rows} tableId="GRI3" />
          </div>
        </CardContent>
      </Card>

      {/* 하단 정보 */}
      <div className="flex items-start p-4 rounded-md bg-customG/5">
        <div className="flex-1 text-sm text-gray-600">
          <h4 className="mb-2 font-medium text-customG">GRI 3 개요</h4>
          <p>
            GRI 3는 조직이 '중요 주제(Material Topics)'를 식별하고 관리하는 방법에 대한
            표준입니다. 이는 이해관계자들에게 가장 중요한 경제적, 환경적, 사회적 영향을
            파악하고 보고하는 프로세스를 설명합니다.
          </p>
        </div>
      </div>
    </div>
  )
}
