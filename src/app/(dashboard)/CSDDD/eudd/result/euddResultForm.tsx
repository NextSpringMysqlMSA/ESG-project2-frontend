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
export default function EUDDResultPage() {
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

  /**
   * 심각도에 따른 스타일 클래스 계산
     /**
   * 심각도에 따른 스타일 클래스 계산
   * - 텍스트 내용에 따라 적절한 색상 클래스를 반환
   * - 위험도가 높은 항목은 빨간색, 중간은 노란색, 낮은 항목은 녹색으로 표시
   * @param text 분석 결과 텍스트
   * @returns 적절한 Tailwind CSS 클래스 문자열
   */
  const getSeverityClass = (text: string): string => {
    // null이나 undefined 체크
    const lowerText = text?.toLowerCase() || ''

    // 심각도 높음 조건
    if (
      lowerText.includes('심각') ||
      lowerText.includes('높음') ||
      lowerText.includes('예')
    ) {
      return 'bg-red-50 text-red-600 border-red-100'
    }
    // 심각도 중간 조건
    else if (lowerText.includes('중간') || lowerText.includes('부분')) {
      return 'bg-amber-50 text-amber-600 border-amber-100'
    }
    // 심각도 낮음 조건
    else if (
      lowerText.includes('낮음') ||
      lowerText.includes('없음') ||
      lowerText.includes('아니요')
    ) {
      return 'bg-green-50 text-green-600 border-green-100'
    }

    // 기본 스타일
    return 'bg-gray-50 text-gray-600 border-gray-200'
  }

  // ======== 통계 데이터 계산 ========
  /**
   * 위험 요약 통계 계산
   * - 위반 항목 수, 벌금 적용 항목 수, 형사 처벌 가능 항목 수 등을 계산
   */
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
        <BreadcrumbLink href="/csddd" className="hover:text-customG">
          공급망 실사
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">EU 공급망실사</span>
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
          href="/csddd/eudd"
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
          href: '/csddd/eudd'
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
          <motion.div
            initial={{opacity: 0, y: 20}} // 초기 상태 (투명하고 아래로 이동)
            animate={{opacity: 1, y: 0}} // 애니메이션 최종 상태
            transition={{duration: 0.5, delay: 0.2}} // 애니메이션 시간 및 지연
          >
            <Card className="shadow-sm">
              {/* 테이블 헤더 */}
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
                      CSDD
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              {/* 테이블 내용 */}
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
                      {/* 결과 데이터 매핑 */}
                      {results
                        .filter(id => analysisData[id]) // 유효한 데이터만 필터링
                        .map((id, index) => (
                          <tr
                            key={id}
                            className={cn(
                              'hover:bg-gray-50 transition-colors',
                              // 짝수/홀수 행 배경색 다르게 설정
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            )}>
                            {/* 위반 항목명 */}
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-800">
                                {analysisData[id].questionText}
                              </div>
                              <div className="mt-1 text-xs text-gray-500">ID: {id}</div>
                            </td>

                            {/* 법적 해당 여부 */}
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  // 심각도에 따른 스타일 적용
                                  getSeverityClass(analysisData[id].legalRelevance)
                                )}>
                                {analysisData[id].legalRelevance}
                              </span>
                            </td>

                            {/* 관련 조항 */}
                            <td className="px-6 py-4">
                              <div className="max-w-xs text-sm text-gray-600">
                                {analysisData[id].legalBasis}
                              </div>
                            </td>

                            {/* 벌금 범위 */}
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  // 심각도에 따른 스타일 적용
                                  getSeverityClass(analysisData[id].fineRange)
                                )}>
                                {analysisData[id].fineRange}
                              </span>
                            </td>

                            {/* 형사처벌 여부 */}
                            <td className="px-6 py-4">
                              <span
                                className={cn(
                                  'inline-block px-2 py-1 text-xs font-medium rounded-full border',
                                  // 심각도에 따른 스타일 적용
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

            {/* ======== 주의사항 섹션 ======== */}
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
        {/* LoadingState 닫는 태그 */}
      </LoadingState>
    </div>
  )
}
