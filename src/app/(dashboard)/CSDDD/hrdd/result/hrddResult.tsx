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
import {Badge} from '@/components/ui/badge'
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

  /**
   * 위반 심각도에 따른 스타일 클래스 반환
   * - 텍스트 내용에 따라 색상 클래스 반환
   * - 심각, 높음, 예 → 빨간색
   * - 중간, 부분 → 노란색
   * - 낮음, 없음, 아니요 → 녹색
   *
   * @param text 위반 심각도 텍스트
   * @returns 스타일 클래스명
   */
  const getSeverityClass = (text: string): string => {
    const lowerText = text?.toLowerCase() || ''

    if (
      lowerText.includes('심각') ||
      lowerText.includes('높음') ||
      lowerText.includes('예')
    ) {
      return 'bg-red-50 text-red-600 border-red-100'
    } else if (lowerText.includes('중간') || lowerText.includes('부분')) {
      return 'bg-amber-50 text-amber-600 border-amber-100'
    } else if (
      lowerText.includes('낮음') ||
      lowerText.includes('없음') ||
      lowerText.includes('아니요')
    ) {
      return 'bg-green-50 text-green-600 border-green-100'
    }

    return 'bg-gray-50 text-gray-600 border-gray-200'
  }

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
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-slate-50">
      {/* 네비게이션 경로 */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <BreadcrumbLink href="/CSDDD" className="hover:text-customG">
          공급망 실사
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">인권 실사</span>
      </motion.div>

      {/* 페이지 헤더 */}
      <PageHeader
        icon={<FileCheck className="w-6 h-6" />}
        title="인권 실사 자가진단 결과"
        description="인권 실사 지침 요구사항 이행 자가진단 결과 확인"
        gradient="from-green-100 to-green-50"
        iconColor="text-customG">
        <Link
          href="/CSDDD/hrdd"
          className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md shadow-sm text-customG border-customG hover:bg-customGLight/20">
          {results.length > 0 ? '자가진단 다시하기' : '자가진단 시작하기'}
        </Link>
      </PageHeader>

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
            <Card className="shadow-sm">
              <CardHeader className="p-4 bg-white border-b">
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      위반 항목 상세 분석
                    </CardTitle>
                    <CardDescription>
                      자가진단에서 식별된 위반 가능성이 있는 항목들입니다
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-600 border-blue-100 pl-1.5">
                      <FileCheck className="w-3.5 h-3.5 mr-1" />
                      HRDD
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 font-medium">위반 항목</th>
                        <th className="px-6 py-3 font-medium">법적 해당 여부</th>
                        <th className="px-6 py-3 font-medium">관련 조항</th>
                        <th className="px-6 py-3 font-medium">벌금 범위</th>
                        <th className="px-6 py-3 font-medium">형사처벌 여부</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results
                        .filter(id => analysisData[id])
                        .map((id, index) => (
                          <tr
                            key={id}
                            className={cn(
                              'hover:bg-gray-50 transition-colors',
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            )}>
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-800">
                                {analysisData[id].questionText}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">ID: {id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  getSeverityClass(analysisData[id].legalRelevance)
                                )}>
                                {analysisData[id].legalRelevance}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs text-sm text-gray-600">
                                {analysisData[id].legalBasis}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  getSeverityClass(analysisData[id].fineRange)
                                )}>
                                {analysisData[id].fineRange}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  getSeverityClass(analysisData[id].criminalLiability)
                                )}>
                                {analysisData[id].criminalLiability}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 면책 정보 */}
            <div className="p-4 mt-6 border-l-2 border-blue-300 rounded-sm bg-blue-50">
              <div className="flex">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                <p className="text-sm text-blue-600">
                  위 결과는 자가진단에 기반한 참고용 정보입니다. 정확한 법적 조언은
                  전문가와 상담하세요.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      </LoadingState>
    </div>
  )
}
