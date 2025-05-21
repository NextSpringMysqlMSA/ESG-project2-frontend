'use client'

import KPIGoal from './kpiGoal'
import NetZero from './netZero'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import CollapsibleWindow from '@/components/tools/collapsibleWindow'
import {Line} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {useEffect, useState} from 'react'
import {useKPIGoalStore} from '@/stores/IFRS/goal/useKPIGoalStore'
import {KPIGoalState, NetZeroResponse} from '@/types/IFRS/goal'
import {fetchKPIGoal, fetchNetZeroList} from '@/services/goal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {motion} from 'framer-motion'
import {
  Home,
  ChevronRight,
  BarChart3,
  Target,
  Edit2,
  Plus,
  ArrowDown,
  PlusCircle
} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {PageHeader} from '@/components/layout/PageHeader'
import {Skeleton} from '@/components/ui/skeleton'
import {LoadingState} from '@/components/ui/loading-state'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  ChartDataLabels,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

export default function Goal() {
  // 데이터 로딩 상태
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [netZeroLoading, setNetZeroLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [netZeroError, setNetZeroError] = useState<string | null>(null)
  const [selectedNetZeroId, setSelectedNetZeroId] = useState<number | null>(null)
  const [netZeroData, setNetZeroData] = useState<NetZeroResponse[]>([])

  // KPI 목표 데이터 관련 상태 관리
  const {data: kpiGoalData, setData: setKpiGoalData} = useKPIGoalStore()

  // 데이터 통계 - governance.tsx와 유사하게 구현
  const stats = {
    netZero: netZeroData?.length || 0,
    kpiGoals: kpiGoalData?.length || 0,
    total: (netZeroData?.length || 0) + (kpiGoalData?.length || 0)
  }

  // 넷제로 데이터를 차트 형식으로 변환 - 로직 개선
  const getNetZeroChartData = () => {
    if (netZeroData.length === 0 || !netZeroData[0].emissions) {
      return {
        labels: ['준비 중...'],
        datasets: [
          {
            label: '넷제로 배출량',
            data: [0],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            backgroundColor: 'rgba(75, 192, 192, 0.5)'
          }
        ]
      }
    }

    try {
      // 첫 번째 넷제로 데이터 사용
      const firstData = netZeroData[0]

      // emissions 데이터를 연도 순으로 정렬
      const sortedEmissions = [...firstData.emissions].sort((a, b) => a.year - b.year)

      // 정렬된 데이터에서 연도와 배출량 추출
      const years = sortedEmissions.map(item => item.year.toString())
      const emissionValues = sortedEmissions.map(item => item.emission)

      const calculateTargetPath = () => {
        if (emissionValues.length < 2) return []

        const firstValue = emissionValues[0]
        const lastValue = emissionValues[emissionValues.length - 1]
        const totalSteps = emissionValues.length - 1

        return emissionValues.map((_, index) => {
          return firstValue - (firstValue - lastValue) * (index / totalSteps)
        })
      }

      console.log('차트 데이터:', {years, emissionValues}) // 디버깅용 로그

      return {
        labels: years,
        datasets: [
          {
            label: '넷제로 배출량 (tCO2e)',
            data: emissionValues,
            borderColor: '#4bc0c0',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.3,
            pointRadius: 6,
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#059669',
            pointBorderWidth: 2,
            fill: true
          },
          {
            label: ' 목표 경로',
            data: calculateTargetPath(),
            borderColor: '#4bc0c0',
            borderDash: [5, 5],
            backgroundColor: 'transparent',
            tension: 0.1,
            pointRadius: 0,
            fill: false
          }
        ]
      }
    } catch (error) {
      console.error('차트 데이터 생성 중 오류:', error)

      // 오류 발생 시 빈 차트 데이터 반환
      return {
        labels: ['데이터 오류'],
        datasets: [
          {
            label: '넷제로 배출량',
            data: [0],
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
          }
        ]
      }
    }
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('ko-KR').format(context.parsed.y) + ' tCO2e'
            }
            return label
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return new Intl.NumberFormat('ko-KR').format(value)
          }
        }
      }
    }
  }

  const kpiGoalHeader = [
    '지표',
    '세부 지표',
    '단위',
    '목표연도',
    '기준연도',
    '기준값',
    '목표수치',
    '현재수치'
  ]

  // 컴포넌트 마운트 시 모든 데이터 한 번에 로드 - governance.tsx와 유사한 패턴
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true)
        setNetZeroLoading(true)
        setError(null)
        setNetZeroError(null)

        // 병렬로 두 API 호출
        const [kpiGoalResult, netZeroResult] = await Promise.all([
          fetchKPIGoal(),
          fetchNetZeroList()
        ])

        // KPI 목표 데이터 설정
        setKpiGoalData(kpiGoalResult)

        // NetZero 데이터 설정
        if (Array.isArray(netZeroResult) && netZeroResult.length > 0) {
          console.log('넷제로 응답 데이터:', netZeroResult)

          setNetZeroData(netZeroResult)

          // 첫 번째 항목 ID 선택
          if (netZeroResult.length > 0) {
            setSelectedNetZeroId(netZeroResult[0].id)
          }
        } else {
          console.log('넷제로 데이터 없음')
          setNetZeroData([])
        }
      } catch (err) {
        console.error('데이터 로드 중 오류 발생:', err)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
        setNetZeroLoading(false)
      }
    }

    loadAllData()
  }, [setKpiGoalData])

  // 개별 API 리로드 함수 (필요할 때만 호출)
  const loadKPIGoalData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchKPIGoal()
      setKpiGoalData(data)
    } catch (err) {
      console.error('KPI 목표 데이터 로드 실패:', err)
      setError('KPI 목표 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadNetZeroData = async () => {
    setNetZeroLoading(true)
    setNetZeroError(null)
    try {
      console.log('넷제로 데이터 로드 시작')
      const data = await fetchNetZeroList()

      if (Array.isArray(data) && data.length > 0) {
        setNetZeroData(data)

        // 첫 번째 항목 선택
        if (data.length > 0) {
          setSelectedNetZeroId(data[0].id)
        }
      } else {
        setNetZeroData([])
      }
    } catch (err) {
      console.error('NetZero 데이터 로드 실패:', err)
      setNetZeroError('NetZero 데이터를 불러오는데 실패했습니다.')
    } finally {
      setNetZeroLoading(false)
    }
  }

  // KPI 목표 테이블에 표시할 데이터 형식으로 변환
  const formatKPIGoalData = (data: KPIGoalState[]) => {
    return data.map(item => ({
      id: item.id,
      values: [
        item.indicator,
        item.detailedIndicator,
        item.unit,
        item.goalYear !== undefined ? item.goalYear.toString() : '-',
        item.baseYear !== undefined ? item.baseYear.toString() : '-',
        item.referenceValue !== undefined ? item.referenceValue.toString() : '-',
        item.targetValue !== undefined ? item.targetValue.toString() : '-',
        item.currentValue !== undefined ? item.currentValue.toString() : '-'
      ]
    }))
  }

  const handleNetZeroAdd = () => {
    setIsAddOpen(true)
  }

  const handleNetZeroClose = () => {
    setIsAddOpen(false)
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      {/* 상단 네비게이션 - 유지 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>대시보드</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>ESG 공시</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>IFRS S2</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-emerald-600">목표 및 지표</span>
      </div>

      {/* 헤더 섹션 - PageHeader 컴포넌트 사용 */}
      <PageHeader
        icon={<BarChart3 className="w-6 h-6" />}
        title="목표 및 지표"
        description="IFRS S2/TCFD 기반 기후 목표 및 지표 관리"
        module="IFRS"
        submodule="goal"></PageHeader>

      {/* 통계 카드 - governance.tsx와 유사하게 추가 */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.4, delay: 0.1}}
        className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="flex items-center p-4">
            <div className="p-2 mr-3 rounded-full bg-emerald-100">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">넷제로 목표</p>
              <h3 className="text-2xl font-gmBold">
                {netZeroLoading ? <Skeleton className="w-8 h-8" /> : stats.netZero}
                <span className="ml-1 text-sm font-normal text-gray-500">개</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="flex items-center p-4">
            <div className="p-2 mr-3 bg-purple-100 rounded-full">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">KPI 목표</p>
              <h3 className="text-2xl font-gmBold">
                {loading ? <Skeleton className="w-8 h-8" /> : stats.kpiGoals}
                <span className="ml-1 text-sm font-normal text-gray-500">개</span>
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="flex items-center p-4">
            <div className="p-2 mr-3 bg-blue-100 rounded-full">
              <ArrowDown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">총 데이터</p>
              <h3 className="text-2xl font-gmBold">
                {loading || netZeroLoading ? (
                  <Skeleton className="w-8 h-8" />
                ) : (
                  stats.total
                )}
                <span className="ml-1 text-sm font-normal text-gray-500">개</span>
              </h3>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ----------------------------------------------------------------------------- */}
      {/* 메인 콘텐츠 - LoadingState 컴포넌트 사용 */}
      <LoadingState
        isLoading={loading && netZeroLoading}
        error={error || netZeroError}
        isEmpty={stats.total === 0}
        showFormWhenEmpty={true}
        emptyMessage="목표 및 지표 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => setIsAddOpen(true)
        }}>
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.2}}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="p-4 bg-white border-b">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-xl">목표 및 KPI 관리</CardTitle>
                  <CardDescription>
                    기후 변화 관련 목표 및 성과 지표를 관리합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="bg-white rounded-b-lg">
                <Accordion type="multiple" className="p-4">
                  <AccordionItem
                    value="item-1"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-emerald-50 to-white">
                      <div className="flex items-center">
                        <Target className="w-5 h-5 mr-2 text-emerald-600" />
                        넷제로 분석 결과
                        <Badge
                          variant="outline"
                          className="ml-2 border-emerald-100 bg-emerald-50">
                          {netZeroData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="p-4">
                      <div className="flex flex-row mb-4">
                        {netZeroLoading ? (
                          <Skeleton className="w-32 h-9" />
                        ) : netZeroData.length > 0 ? (
                          // 데이터가 이미 있으면 수정 버튼만 표시
                          // ------------------------------------------------------------------------
                          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <div className="flex flex-row items-center justify-between w-full">
                              <div className="text-sm text-gray-500 min-h-[20px]">
                                목표 설정이 완료되었습니다
                              </div>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="flex items-center gap-1 text-white bg-emerald-600 hover:bg-emerald-700">
                                  <Edit2 className="w-4 h-4 mr-1" /> 넷제로 목표 수정
                                </Button>
                              </DialogTrigger>
                            </div>
                            <DialogContent className="sm:max-w-[550px]">
                              <DialogHeader>
                                <DialogTitle
                                  className="flex items-center text-xs sr-only"
                                  hidden
                                />
                              </DialogHeader>
                              {selectedNetZeroId && (
                                <NetZero
                                  onClose={() => {
                                    setIsEditOpen(false)
                                    loadNetZeroData() // 데이터 다시 로드
                                  }}
                                  rowId={selectedNetZeroId}
                                  mode="edit"
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                        ) : (
                          // 데이터가 없을 때만 추가 버튼 표시
                          // ------------------------------------------------------------------------
                          <div className="flex">
                            {/* 오른쪽 버튼 */}
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="flex items-center gap-1 text-white bg-emerald-600 hover:bg-emerald-700">
                                  <PlusCircle className="w-4 h-4 mr-1" /> 넷제로 목표 설정
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[550px]">
                                <DialogHeader>
                                  <DialogTitle
                                    className="flex items-center text-xs sr-only"
                                    hidden
                                  />
                                </DialogHeader>
                                <NetZero
                                  onClose={() => {
                                    handleNetZeroClose()
                                    loadNetZeroData() // 데이터 다시 로드
                                  }}
                                  mode="add"
                                />
                              </DialogContent>
                            </Dialog>
                          </div>
                          // -----------------------------------------------------------------------
                        )}
                      </div>

                      {netZeroLoading ? (
                        <div className="flex flex-col items-center justify-center p-8 space-y-2">
                          <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-emerald-600"></div>
                          <p className="text-sm text-emerald-600">데이터 로딩 중...</p>
                        </div>
                      ) : netZeroError ? (
                        <div className="p-6 text-center border border-red-100 rounded-md bg-red-50">
                          <div className="flex items-center justify-center mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-6 h-6 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <p className="text-red-600">{netZeroError}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={loadNetZeroData}>
                            다시 시도
                          </Button>
                        </div>
                      ) : netZeroData.length === 0 ? (
                        <div className="p-6 text-center border rounded-md bg-slate-50">
                          <div className="flex flex-col items-center justify-center p-8 space-y-4">
                            <div className="p-3 rounded-full bg-emerald-100">
                              <Target className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="max-w-sm space-y-2">
                              <h4 className="text-lg font-medium text-slate-800">
                                넷제로 목표가 설정되지 않았습니다
                              </h4>
                              <p className="text-sm text-slate-500">
                                기업의 온실가스 배출량 감축 목표를 설정하고 관리하세요.
                                탄소 중립으로 가는 여정의 첫 걸음입니다.
                              </p>
                            </div>
                            {/* ------------------------------------------------------------------- */}
                            <Button
                              onClick={handleNetZeroAdd}
                              className="flex items-center h-5 gap-2 px-3 py-1 mt-2 text-xs text-white rounded-md bg-emerald-600 hover:bg-emerald-700">
                              <PlusCircle className="w-4 h-4 mr-1.5 text-white" />
                              넷제로 목표 설정하기
                            </Button>
                            {/* ------------------------------------------------------------------ */}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="p-4 border rounded-md border-emerald-100 bg-emerald-50">
                              <p className="text-xs text-emerald-600">산업 분야</p>
                              <p className="text-lg font-semibold">
                                {netZeroData[0].industrialSector || '금융업'}
                              </p>
                            </div>
                            <div className="p-4 border rounded-md border-emerald-100 bg-emerald-50">
                              <p className="text-xs text-emerald-600">기준 연도</p>
                              <p className="text-lg font-semibold">
                                {netZeroData[0].baseYear}년
                              </p>
                            </div>
                            <div className="p-4 border rounded-md border-emerald-100 bg-emerald-50">
                              <p className="text-xs text-emerald-600">목표 연도</p>
                              <p className="text-lg font-semibold">
                                {netZeroData[0].targetYear}년
                              </p>
                            </div>
                            <div className="p-4 border rounded-md border-emerald-100 bg-emerald-50">
                              <p className="text-xs text-emerald-600">배출량 감소율</p>
                              {netZeroData[0].emissions &&
                              netZeroData[0].emissions.length >= 2 ? (
                                <p className="text-lg font-semibold">
                                  {Math.round(
                                    ((netZeroData[0].emissions[0].emission -
                                      netZeroData[0].emissions[
                                        netZeroData[0].emissions.length - 1
                                      ].emission) /
                                      netZeroData[0].emissions[0].emission) *
                                      100
                                  )}
                                  %
                                </p>
                              ) : (
                                <p className="text-lg font-medium text-gray-500">-</p>
                              )}
                            </div>
                          </div>

                          {/* 차트 컨테이너 크기 축소 및 스타일 개선 */}
                          <div className="p-4 mx-auto bg-white border rounded-md md:w-4/5 border-emerald-100">
                            <h4 className="mb-3 text-sm font-medium text-center text-emerald-700">
                              연도별 탄소 배출량 추이 (tCO2e)
                            </h4>
                            <div className="h-64">
                              <Line
                                data={getNetZeroChartData()}
                                options={{
                                  ...chartOptions,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    ...chartOptions.plugins,
                                    legend: {
                                      display: false
                                    },
                                    datalabels: {
                                      display: (context: any) =>
                                        context.datasetIndex === 0,
                                      align: -10 as const,
                                      anchor: 'end',
                                      offset: 4,
                                      color: '#059669',
                                      font: {
                                        size: 10,
                                        weight: 'bold'
                                      },
                                      formatter: (value: number) => value.toLocaleString()
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {/* 넷제로 자산 정보 테이블 추가 */}
                          {netZeroData[0].industries &&
                            netZeroData[0].industries.length > 0 && (
                              <div className="mt-4 overflow-hidden border rounded-md border-emerald-100">
                                <div className="p-3 bg-emerald-50">
                                  <h4 className="text-sm font-medium text-emerald-700">
                                    투자/대출 포트폴리오
                                  </h4>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th
                                          scope="col"
                                          className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500">
                                          산업
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500">
                                          자산 유형
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500">
                                          금액 (억원)
                                        </th>
                                        <th
                                          scope="col"
                                          className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500">
                                          총 자산 (억원)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {netZeroData[0].industries.map((asset, index) => (
                                        <tr
                                          key={index}
                                          className={
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                          }>
                                          <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                            {asset.industry}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                            {asset.assetType}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                            {typeof asset.amount === 'number'
                                              ? new Intl.NumberFormat('ko-KR').format(
                                                  asset.amount / 100000000
                                                )
                                              : '-'}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap">
                                            {typeof asset.totalAssetValue === 'number'
                                              ? new Intl.NumberFormat('ko-KR').format(
                                                  asset.totalAssetValue / 100000000
                                                )
                                              : '-'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-purple-50 to-white">
                      <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                        KPI 목표
                        <Badge
                          variant="outline"
                          className="ml-2 text-purple-600 border-purple-100 bg-purple-50">
                          {kpiGoalData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      {loading ? (
                        <div className="flex justify-center p-8">
                          <div className="w-8 h-8 border-t-2 border-b-2 border-purple-600 rounded-full animate-spin"></div>
                        </div>
                      ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                      ) : (
                        <CollapsibleWindow
                          type="kpiGoal"
                          headers={kpiGoalHeader}
                          formContent={({onClose, rowId, mode}) => (
                            <KPIGoal
                              onClose={() => {
                                onClose()
                                loadKPIGoalData() // 닫힐 때 데이터 다시 로드
                              }}
                              rowId={rowId}
                              mode={mode || 'add'}
                            />
                          )}
                          dialogTitle="KPI 목표 설정"
                          data={formatKPIGoalData(kpiGoalData)}
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </LoadingState>
    </div>
  )
}
