'use client'

import {useEffect, useState, useCallback} from 'react'
import type {EuddViolationDto} from '@/types/IFRS/csddd'
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
import {fetchEuddResult} from '@/services/csddd'

/**
 * EU 공급망 실사 지침 자가진단 결과 페이지
 * - 사용자의 자가진단 결과를 시각화하여 보여주는 컴포넌트
 * - 비동기 데이터 로딩 및 오류 처리 기능 포함
 * - 상태 표시를 위한 배지와 테이블을 활용하여 결과 표시
 */
export default function EuddResult() {
  // ======== 상태 관리 ========
  /** 위반 항목 ID 목록 */
  const [results, setResults] = useState<string[]>([])

  /** 위반 항목 상세 데이터 맵 (ID를 키로 사용) */
  const [analysisData, setAnalysisData] = useState<Record<string, EuddViolationDto>>({})

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
  const loadResults = useCallback(async () => {
    try {
      // 로딩 상태 설정 및 이전 오류 초기화
      setIsLoading(true)
      setError(null)

      // API 호출
      const res = await fetchEuddResult()

      // 결과가 배열이 아니거나 비어있는 경우 처리
      if (!Array.isArray(res) || res.length === 0) {
        setResults([])
        setAnalysisData({})
        return
      }

      // 응답 데이터 변환 및 상태 업데이트
      // ID를 키로 하는 객체로 변환하여 빠른 참조가 가능하도록 함
      const mapped = Object.fromEntries(res.map(v => [v.id, v]))
      setResults(Object.keys(mapped))
      setAnalysisData(mapped)
    } catch (error: any) {
      // 404 오류는 데이터가 없는 정상 케이스로 처리
      if (error?.response?.status === 404) {
        setResults([])
        setAnalysisData({})
        return
      }

      // 그 외 오류 처리
      const errorMessage =
        error?.response?.data?.message || '자가진단 결과를 불러오는데 실패했습니다'
      setError(errorMessage)
      showError(errorMessage)

      // 개발 환경에서만 콘솔에 오류 출력
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ 분석 결과 불러오기 실패:', error)
      }
    } finally {
      // 로딩 상태 종료
      setIsLoading(false)
    }
  }, []) // 의존성 배열 비움 - 컴포넌트 마운트 시 한 번만 생성

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadResults()
  }, [loadResults]) // loadResults 함수가 변경될 때 다시 실행

  const stats = {
    violations: results.length, // 전체 위반 항목 수

    // 벌금이 부과될 수 있는 항목 수
    fines: results.filter(
      id => analysisData[id]?.fineRange && !analysisData[id]?.fineRange.includes('없음')
    ).length,

    // 형사처벌 위험이 있는 항목 수
    criminal: results.filter(
      id =>
        analysisData[id]?.criminalLiability &&
        analysisData[id]?.criminalLiability.includes('예')
    ).length
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-slate-50">
      {/* ======== 상단 네비게이션 ======== */}
      <motion.div
        initial={{opacity: 0, y: -10}} // 초기 상태 (투명하고 약간 위로 이동)
        animate={{opacity: 1, y: 0}} // 애니메이션 최종 상태
        transition={{duration: 0.3}} // 애니메이션 시간
        className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <BreadcrumbLink href="/CSDDD" className="hover:text-customG">
          공급망 실사
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">EU 공금망 실사 결과</span>
      </motion.div>

      {/* ======== 헤더 섹션 ======== */}
      <PageHeader
        icon={<FileCheck className="w-6 h-6" />}
        title="EU 공급망 실사 자가진단 결과"
        description="EU 공급망 실사 지침 요구사항 이행 자가진단 결과 확인"
        gradient="from-green-100 to-green-50" // 그라데이션 배경
        iconColor="text-customG" // 아이콘 색상
      >
        <Link
          href="/CSDDD/eudd"
          className="px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-md shadow-sm text-customG border-customG hover:bg-customGLight/20">
          {results.length > 0 ? '자가진단 다시하기' : '자가진단 시작하기'}
        </Link>
      </PageHeader>

      {/* ======== 로딩 상태, 오류, 데이터 없음 처리 ======== */}
      <LoadingState
        isLoading={isLoading} // 로딩 중 여부
        error={error} // 오류 메시지
        isEmpty={!isLoading && !error && results.length === 0} // 데이터가 비어있는지 여부
        emptyMessage="자가진단 결과가 없습니다" // 데이터 없을 때 메시지
        emptyIcon={<CheckCircle2 className="w-16 h-16" />} // 데이터 없을 때 아이콘
        emptyAction={{
          // 데이터 없을 때 액션 버튼
          label: '자가진단 시작하기',
          href: '/CSDDD/eudd'
        }}
        retryAction={loadResults} // 다시 시도 액션
      >
        {/* LoadingState 내부 컨텐츠: 데이터가 있고, 로딩 중이 아닐 때만 표시 */}
        <>
          {/* ======== 통계 카드 섹션 ======== */}
          <motion.div
            initial={{opacity: 0}} // 초기 상태 (투명)
            animate={{opacity: 1}} // 애니메이션 최종 상태
            transition={{duration: 0.4, delay: 0.1}} // 애니메이션 시간 및 지연
            className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3" // 반응형 그리드
          >
            {/* 위반 항목 통계 카드 */}
            <StatCard
              title="위반 항목"
              count={stats.violations}
              icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
              color="red" // 색상 테마
              description="식별된 위반 항목"
            />
            {/* 벌금 적용 항목 통계 카드 */}
            <StatCard
              title="벌금 적용 항목"
              count={stats.fines}
              icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
              color="amber" // 색상 테마
              description="벌금이 부과될 수 있는 항목"
            />
            {/* 형사처벌 가능 항목 통계 카드 */}
            <StatCard
              title="형사처벌 가능"
              count={stats.criminal}
              icon={<Info className="w-5 h-5 text-purple-500" />}
              color="purple" // 색상 테마
              description="형사처벌 위험이 있는 항목"
            />
          </motion.div>

          {/* ======== 결과 테이블 섹션 ======== */}
          {/* ======== 결과 테이블 섹션 ======== */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.2}}>
            <Card className="overflow-hidden border border-gray-100 shadow-sm">
              {/* 테이블 헤더 */}
              <CardHeader className="p-5 bg-white border-b">
                <div className="flex flex-col justify-between md:flex-row md:items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-customG">
                      위반 항목 상세 분석
                    </CardTitle>
                    <CardDescription>
                      자가진단에서 식별된 위반 가능성이 있는 항목들입니다
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Badge
                      variant="outline"
                      className="bg-customG/10 text-customG border-customG/20 pl-1.5">
                      <FileCheck className="w-3.5 h-3.5 mr-1" />
                      CSDD
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* 테이블 내용 */}
              <CardContent className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    {/* 테이블 헤더 디자인 개선 - 더 큰 글씨와 테마 색상 적용 */}
                    <thead className="text-sm font-semibold uppercase border-b text-customGTextLight border-customGBorder bg-customGLight">
                      <tr>
                        <th className="px-6 py-4">위반 항목</th>
                        <th className="px-6 py-4">법적 해당 여부</th>
                        <th className="px-6 py-4">관련 조항</th>
                        <th className="px-6 py-4">벌금 범위</th>
                        <th className="px-6 py-4">형사처벌 여부</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-customGBorder">
                      {/* 결과 데이터 매핑 */}
                      {results
                        .filter(id => analysisData[id])
                        .map((id, index) => (
                          <tr
                            key={id}
                            className={cn(
                              'transition-colors hover:bg-customGLight/80',
                              index % 2 === 0 ? 'bg-white' : 'bg-customGLight/30'
                            )}>
                            {/* 위반 항목명 - 더 큰 글씨로 개선 */}
                            <td className="px-6 py-5 border-l-2 border-transparent hover:border-customG">
                              <div className="text-base font-medium text-gray-900">
                                {analysisData[id].questionText}
                              </div>
                              <div className="mt-2">
                                <span className="px-2.5 py-1 bg-customGLight rounded-full text-customG text-sm font-medium">
                                  ID: {id}
                                </span>
                              </div>
                            </td>

                            {/* 법적 해당 여부 - 배지 크기 개선 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <span
                                  className={cn(
                                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border',
                                    analysisData[id].legalRelevance === '예'
                                      ? 'bg-red-50 text-red-600 border-red-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  )}>
                                  {analysisData[id].legalRelevance === '예' && (
                                    <svg
                                      className="w-4 h-4 mr-1.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        fill="currentColor"
                                        opacity="0.2"
                                      />
                                      <path
                                        d="M8 12L11 15L16 10"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                  {analysisData[id].legalRelevance}
                                </span>
                              </div>
                            </td>

                            {/* 관련 조항 - 텍스트 크기 개선 및 줄바꿈 방지 */}
                            <td className="px-6 py-5">
                              <div className="px-4 py-3 text-sm font-medium text-gray-800 border rounded-md border-customGBorder bg-customGLight/40">
                                {analysisData[id].legalBasis || (
                                  <span className="text-gray-500">해당 없음</span>
                                )}
                              </div>
                            </td>

                            {/* 벌금 범위 - 배지 크기 개선 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <span
                                  className={cn(
                                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap',
                                    analysisData[id].fineRange.includes('최대') ||
                                      analysisData[id].fineRange.includes('100000')
                                      ? 'bg-amber-50 text-amber-600 border-amber-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  )}>
                                  {(analysisData[id].fineRange.includes('최대') ||
                                    analysisData[id].fineRange.includes('100000')) && (
                                    <svg
                                      className="w-4 h-4 mr-1.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        fill="currentColor"
                                        opacity="0.2"
                                      />
                                      <path
                                        d="M12 8V16M12 8L8 12M12 8L16 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                  {analysisData[id].fineRange}
                                </span>
                              </div>
                            </td>

                            {/* 형사처벌 여부 - 배지 크기 개선 */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <span
                                  className={cn(
                                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-full border',
                                    analysisData[id].criminalLiability === '예'
                                      ? 'bg-red-50 text-red-600 border-red-100'
                                      : 'bg-green-50 text-green-600 border-green-100'
                                  )}>
                                  {analysisData[id].criminalLiability === '예' && (
                                    <svg
                                      className="w-4 h-4 mr-1.5"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                        fill="currentColor"
                                        opacity="0.2"
                                      />
                                      <path
                                        d="M12 8V13M12 16V16.01"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                  )}
                                  {analysisData[id].criminalLiability}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* ======== 주의사항 섹션 - 테마색으로 변경 ======== */}
            <div className="p-5 mt-6 border-l-4 rounded-md shadow-sm border-customG bg-customG/5">
              <div className="flex items-start">
                <Info className="w-5 h-5 mr-2.5 mt-0.5 text-customG flex-shrink-0" />
                <div>
                  <p className="mb-1 font-medium text-customG">참고 사항</p>
                  <p className="text-sm text-gray-700">
                    위 결과는 자가진단에 기반한 참고용 정보입니다. 정확한 법적 조언은
                    전문가와 상담하세요.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
        {/* LoadingState 닫는 태그 */}
      </LoadingState>
    </div>
  )
}
