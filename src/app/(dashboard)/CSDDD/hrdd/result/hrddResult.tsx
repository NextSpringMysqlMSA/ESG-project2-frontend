'use client'

import {useEffect, useState, useCallback} from 'react'
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
import {showError} from '@/util/toast'
import {
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Home,
  AlertCircle,
  Info,
  CheckCircle2
} from 'lucide-react'
import {motion} from 'framer-motion'
import Link from 'next/link'
import {cn} from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {StatCard} from '@/components/ui/stat-card'
import {LoadingState} from '@/components/ui/loading-state'
import {PageHeader} from '@/components/layout/PageHeader'
import {fetchHrddResult} from '@/services/csddd'
import type {HrddViolationDto} from '@/types/IFRS/csddd'

/**
 * 인권 실사(HRDD) 지침 자가진단 결과 페이지
 *
 * 사용자의 인권 실사 자가진단 결과를 시각화하여 보여주는 컴포넌트
 * 위반 항목 수, 벌금 적용 항목, 형사처벌 가능 항목 등의 통계와
 * 상세한 위반 항목 리스트를 테이블 형식으로 제공합니다.
 */
export default function Hrdddesult() {
  // 상태 관리
  /** 위반 항목 ID 목록 */
  const [results, setResults] = useState<string[]>([])

  /** 위반 항목 상세 데이터 맵 (ID를 키로 사용) */
  const [analysisData, setAnalysisData] = useState<Record<string, HrddViolationDto>>({})

  /** 데이터 로딩 상태 */
  const [isLoading, setIsLoading] = useState(true)

  /** 오류 메시지 */
  const [error, setError] = useState<string | null>(null)

  /**
   * 결과 데이터 로드 함수
   * - 백엔드 API로부터 결과 데이터를 비동기적으로 가져옴
   * - 로딩 상태 및 오류 처리 포함
   * - 응답 데이터를 적절한 형식으로 변환하여 상태 업데이트
   */
  const loadResults = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetchHrddResult()

      if (!Array.isArray(res) || res.length === 0) {
        setResults([])
        setAnalysisData({})
        return
      }

      // ID를 키로 하는 객체로 변환하여 조회 성능 개선
      const mapped: Record<string, HrddViolationDto> = Object.fromEntries(
        res.map(v => [v.id, v])
      )

      setResults(Object.keys(mapped))
      setAnalysisData(mapped)
    } catch (error: any) {
      // 404 오류는 데이터가 없는 정상 케이스로 처리
      if (error?.response?.status === 404) {
        setResults([])
        setAnalysisData({})
        return
      }

      // 오류 메시지 처리
      const errorMessage =
        error?.response?.data?.message || '자가진단 결과를 불러오는데 실패했습니다'
      setError(errorMessage)
      showError(errorMessage)

      // 개발 환경에서만 상세 오류 로그
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ 분석 결과 불러오기 실패:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadResults()
  }, [loadResults])

  // 통계 데이터 계산
  const stats = {
    violations: results.length,
    fines: results.filter(
      id => analysisData[id]?.fineRange && !analysisData[id]?.fineRange.includes('없음')
    ).length,
    criminal: results.filter(
      id =>
        analysisData[id]?.criminalLiability &&
        analysisData[id]?.criminalLiability.includes('예')
    ).length
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      {/* 네비게이션 경로 */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>공급망 실사</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">인권 실사</span>
      </motion.div>

      {/* 페이지 헤더 */}
      <PageHeader
        icon={<FileCheck className="w-6 h-6" />}
        title="인권 실사 자가진단 결과"
        description="인권 실사 지침 요구사항 이행 자가진단 결과 확인"
        gradient="from-green-100 to-green-50"
        iconColor="text-customG"></PageHeader>

      {/* 로딩/오류/빈 상태 처리 */}
      <LoadingState
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && !error && results.length === 0}
        emptyMessage="자가진단 결과가 없습니다"
        emptyIcon={<CheckCircle2 className="w-16 h-16" />}
        emptyAction={{
          label: '자가진단 시작하기',
          href: '/CSDDD/hrdd'
        }}
        retryAction={loadResults}>
        <>
          {/* 통계 카드 */}
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.4, delay: 0.1}}
            className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
            <StatCard
              title="위반 항목"
              count={stats.violations}
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              color="red"
              description="식별된 위반 항목"
            />
            <StatCard
              title="벌금 적용 항목"
              count={stats.fines}
              icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
              color="amber"
              description="벌금이 부과될 수 있는 항목"
            />
            <StatCard
              title="형사처벌 가능"
              count={stats.criminal}
              icon={<Info className="w-5 h-5 text-purple-500" />}
              color="purple"
              description="형사처벌 위험이 있는 항목"
            />
          </motion.div>

          {/* 상세 결과 테이블 */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}>
            <Card className="overflow-hidden border border-gray-100 shadow-sm">
              <CardHeader className="p-4 bg-white border-b">
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-customG">
                      위반 항목 상세 분석
                    </CardTitle>
                    <CardDescription>
                      자가진단에서 식별된 위반 가능성이 있는 항목들입니다
                    </CardDescription>
                  </div>
                  <div className="flex flex-row items-center space-x-4">
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Link
                        href="/CSDDD"
                        className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md shadow-sm text-customG border-customG hover:bg-customG hover:text-white">
                        실사 유형 선택
                      </Link>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Link
                        href="/CSDDD/hrdd"
                        className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md shadow-sm text-customG border-customG hover:bg-customG hover:text-white">
                        {results.length > 0 ? '자가진단 다시하기' : '자가진단 시작하기'}
                      </Link>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left table-fixed">
                    <colgroup>
                      <col className="w-[30%]" />
                      {/* 위반 항목 */}
                      <col className="w-[15%]" />
                      {/* 법적 해당 여부 */}
                      <col className="w-[20%]" />
                      {/* 관련 조항 */}
                      <col className="w-[20%]" />
                      {/* 벌금 범위 */}
                      <col className="w-[15%]" />
                      {/* 형사처벌 여부 */}
                    </colgroup>
                    <thead className="text-sm font-semibold border-b border-customGBorder bg-gradient-to-r from-green-100 to-white">
                      <tr>
                        <th className="px-6 py-4 text-customG whitespace-nowrap">
                          위반 항목
                        </th>
                        <th className="px-6 py-4 text-customG whitespace-nowrap">
                          법적 해당 여부
                        </th>
                        <th className="px-6 py-4 text-customG whitespace-nowrap">
                          관련 조항
                        </th>
                        <th className="px-6 py-4 text-customG whitespace-nowrap">
                          벌금 범위
                        </th>
                        <th className="px-6 py-4 text-customG whitespace-nowrap">
                          형사처벌 여부
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-customGBorder">
                      {results
                        .filter(id => analysisData[id])
                        .map((id, index) => (
                          <tr
                            key={id}
                            className={cn(
                              'transition-colors hover:bg-customGLight/50 group',
                              index % 2 === 0 ? 'bg-white' : 'bg-customGLight/20'
                            )}>
                            {/* 위반 항목명 - 왼쪽 하이라이트 바와 인권 아이콘 추가 */}
                            <td className="px-6 py-5 border-l-4 border-transparent group-hover:border-customG">
                              <div className="flex items-start">
                                <span className="flex items-center justify-center p-1 mr-3 bg-red-100 rounded-full">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                </span>
                                <div>
                                  <div className="text-base font-medium text-gray-900">
                                    {analysisData[id].questionText}
                                  </div>
                                  <div className="mt-2">
                                    <span className="px-2.5 py-1 bg-customGLight rounded-full text-customG text-sm font-medium">
                                      ID: {id}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 법적 해당 여부 - 아이콘과 배지 디자인 개선 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <div
                                  className={cn(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm border',
                                    analysisData[id].legalRelevance === '예'
                                      ? 'bg-red-50 text-red-600 border-red-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  )}>
                                  {analysisData[id].legalRelevance === '예' ? (
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                  )}
                                  {analysisData[id].legalRelevance}
                                </div>
                              </div>
                            </td>

                            {/* 관련 조항 - 카드 스타일 적용 */}
                            <td className="px-6 py-5">
                              <div className="p-3 text-sm font-medium text-gray-800 bg-white border rounded-lg shadow-sm border-customGBorder group-hover:bg-customGLight/30">
                                {analysisData[id].legalBasis || (
                                  <span className="text-gray-500">해당 없음</span>
                                )}
                              </div>
                            </td>

                            {/* 벌금 범위 - 통화 아이콘 추가 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <div
                                  className={cn(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm border',
                                    analysisData[id].fineRange.includes('최대') ||
                                      analysisData[id].fineRange.includes('100000')
                                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                                      : analysisData[id].fineRange.includes('없음')
                                      ? 'bg-green-50 text-green-600 border-green-100'
                                      : 'bg-blue-50 text-blue-600 border-blue-100'
                                  )}>
                                  {analysisData[id].fineRange.includes('최대') ||
                                  analysisData[id].fineRange.includes('100000') ? (
                                    <span className="mr-2 text-lg">€</span>
                                  ) : analysisData[id].fineRange.includes('없음') ? (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                  ) : (
                                    <Info className="w-4 h-4 mr-2" />
                                  )}
                                  {analysisData[id].fineRange}
                                </div>
                              </div>
                            </td>

                            {/* 형사처벌 여부 - 강조 표시 개선 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <div
                                  className={cn(
                                    'flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm border',
                                    analysisData[id].criminalLiability === '예'
                                      ? 'bg-red-50 text-red-600 border-red-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  )}>
                                  {analysisData[id].criminalLiability === '예' ? (
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                  )}
                                  {analysisData[id].criminalLiability}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* 결과가 없을 때 표시할 메시지 */}
                {results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="p-4 mb-4 bg-green-100 rounded-full">
                      <CheckCircle2 className="w-12 h-12 text-customG" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700">
                      위반 항목이 없습니다
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      현재 인권 실사 요구사항을 모두 준수하고 있습니다
                    </p>
                  </div>
                )}
              </CardContent>

              {/* 요약 정보 섹션 추가 */}
              {results.length > 0 && (
                <div className="p-4 border-t bg-gray-50 border-customGBorder">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center">
                      <Info className="w-5 h-5 mr-2 text-customG" />
                      <span className="text-sm text-gray-600">
                        총{' '}
                        <span className="font-semibold text-customG">
                          {results.length}개
                        </span>
                        의 위반 가능성 항목이 식별되었습니다
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 개선된 면책 정보 */}
            <div className="p-5 mt-6 border-l-4 border-customG bg-blue-50/80 rounded-r-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="w-5 h-5 text-customG" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-customG">
                    법적 책임 면책 안내
                  </h3>
                  <div className="mt-2 text-sm text-customG">
                    <p>
                      본 자가진단 결과는 참고용 정보로 제공되며, 법적 책임에 대한 최종
                      판단이 아닙니다. 중요한 결정을 내리기 전에는 반드시 법률 전문가의
                      상담을 받으시기 바랍니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      </LoadingState>
    </div>
  )
}
