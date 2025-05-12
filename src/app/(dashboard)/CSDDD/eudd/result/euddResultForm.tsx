'use client'

import {useEffect, useState} from 'react'
import {fetchEuddResult, updateEuddAnswers} from '@/services/eudd'
import {getMyInfo} from '@/services/auth'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function EUDDResultPage() {
  const [results, setResults] = useState<string[]>([])
  const [analysisData, setAnalysisData] = useState<Record<string, any>>({})

  useEffect(() => {
    getMyInfo()
      .then(async user => {
        const res = await fetchEuddResult()
        const mapped = Object.fromEntries(res.map((v: any) => [v.id, v]))
        setResults(Object.keys(mapped))
        setAnalysisData(mapped)
      })
      .catch(err => console.error('❌ 분석 결과 불러오기 실패:', err))
  }, [])

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="flex flex-row px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/csddd">공급망 실사</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>EU 공급망실사</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <div className="flex items-center h-12">
          <h1 className="items-center text-xl font-bold text-gray-800">
            EU 공급망 실사 지침 요구사항 이행 자가진단 결과
          </h1>
        </div>
        {results.length === 0 && (
          <div className="flex justify-end mt-4 mb-2">
            <a
              href="/CSDDD/eudd"
              className="px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700">
              자가진단 시작
            </a>
          </div>
        )}
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="font-semibold text-gray-700 bg-gray-50">
            <tr>
              <th className="px-6 py-4 border-b border-gray-200">위반 항목</th>
              <th className="px-6 py-4 border-b border-gray-200">법적 해당 여부</th>
              <th className="px-6 py-4 border-b border-gray-200">관련 조항</th>
              <th className="px-6 py-4 border-b border-gray-200">벌금 범위</th>
              <th className="px-6 py-4 border-b border-gray-200">형사처벌 여부</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {results
              .filter(id => analysisData[id])
              .map(id => (
                <tr key={id} className="transition-colors hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].questionText}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].legalRelevance}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].legalBasis}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].fineRange}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-100">
                    {analysisData[id].criminalLiability}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
