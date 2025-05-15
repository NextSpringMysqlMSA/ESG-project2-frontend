'use client'

import KPIGoal from './kpiGoal'
import NetZero from './netZero'
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
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
  LineElement
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
import {fetchKPIGoal, fetchNetZeroList, fetchNetZeroById} from '@/services/goal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {IFRSGoalButton} from '@/components/buttons/module-buttons'
import {motion} from 'framer-motion'
import {Home, ChevronRight, BarChart3, Target, Edit, Edit2} from 'lucide-react'
import {Badge} from '@/components/ui/badge'
import {PageHeader} from '@/components/layout/PageHeader'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
)

export default function Goal() {
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

      console.log('차트 데이터:', {years, emissionValues}) // 디버깅용 로그

      return {
        labels: years,
        datasets: [
          {
            label: '넷제로 배출량 (tCO2e)',
            data: emissionValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
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

  // KPI 목표 데이터 로드 함수
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

  // NetZero 데이터 로드 함수 개선
  const loadNetZeroData = async () => {
    setNetZeroLoading(true)
    setNetZeroError(null)
    try {
      console.log('넷제로 데이터 로드 시작')
      const data = await fetchNetZeroList()

      if (Array.isArray(data) && data.length > 0) {
        console.log('넷제로 응답 데이터:', data)

        // emissions 배열 확인
        if (data[0].emissions && Array.isArray(data[0].emissions)) {
          console.log('emissions 데이터:', data[0].emissions)
        } else {
          console.warn('emissions 데이터가 없거나 배열이 아닙니다')
        }

        setNetZeroData(data)

        // 첫 번째 항목 선택
        if (data.length > 0) {
          setSelectedNetZeroId(data[0].id)
        }
      } else {
        console.log('넷제로 데이터 없음')
        setNetZeroData([])
      }
    } catch (err) {
      console.error('NetZero 데이터 로드 실패:', err)
      setNetZeroError('NetZero 데이터를 불러오는데 실패했습니다.')
    } finally {
      setNetZeroLoading(false)
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadKPIGoalData()
    loadNetZeroData()
  }, [])

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
  const handleNetZeroClose = () => {
    setIsAddOpen(false)
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-slate-50">
      {/* 상단 네비게이션 - 유지 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <BreadcrumbLink href="/official" className="hover:text-customG">
          ESG 공시
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <BreadcrumbLink href="/official" className="hover:text-customG">
          IFRS S2
        </BreadcrumbLink>
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

      {/* 메인 콘텐츠 */}
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
                        1
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <div className="flex flex-row justify-end mb-4 space-x-2">
                      {netZeroData.length > 0 && (
                        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                          <DialogTrigger asChild>
                            <IFRSGoalButton
                              size="sm"
                              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600">
                              <Edit2 className="w-4 h-4 mr-1" /> 넷제로 목표 수정
                            </IFRSGoalButton>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>넷제로 목표 수정</DialogTitle>
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
                      )}
                      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                          <IFRSGoalButton size="sm" className="flex items-center gap-1">
                            + 넷제로 목표 설정
                          </IFRSGoalButton>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>넷제로 목표 설정</DialogTitle>
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
                    {netZeroLoading ? (
                      <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-emerald-600"></div>
                      </div>
                    ) : netZeroError ? (
                      <div className="p-4 text-center text-red-500">{netZeroError}</div>
                    ) : netZeroData.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>설정된 넷제로 목표가 없습니다.</p>
                        <p className="mt-2 text-sm">
                          위의 '넷제로 목표 설정' 버튼을 클릭하여 목표를 추가해주세요.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                          <div className="p-4 border rounded-md border-emerald-100 bg-emerald-50">
                            <p className="text-xs text-emerald-600">산업 분야</p>
                            <p className="text-lg font-semibold">
                              {netZeroData[0].industrialSector}
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
                              netZeroData[0].emissions.length >= 2 && (
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
                              )}
                          </div>
                        </div>
                        <div className="p-4 bg-white border rounded-md border-emerald-100">
                          <Line data={getNetZeroChartData()} options={chartOptions} />
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="mb-3 overflow-hidden border rounded-md shadow-sm">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      KPI 목표
                      <Badge
                        variant="outline"
                        className="ml-2 border-blue-100 bg-blue-50">
                        {kpiGoalData.length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    {loading ? (
                      <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-emerald-600"></div>
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
    </div>
  )
}
