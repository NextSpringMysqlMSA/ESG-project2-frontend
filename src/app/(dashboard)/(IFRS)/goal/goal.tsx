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
import {KPIGoalState} from '@/types/IFRS/goal'
import {fetchKPIGoal} from '@/services/goal'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {IFRSGoalButton} from '@/components/buttons/module-buttons'
import {motion} from 'framer-motion'
import {Home, ChevronRight, BarChart3, Target} from 'lucide-react'
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // KPI 목표 데이터 관련 상태 관리
  const {data: kpiGoalData, setData: setKpiGoalData} = useKPIGoalStore()

  const chartData = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월'],
    datasets: [
      {
        label: '넷제로 분석 결과',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0
      }
    ]
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

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadKPIGoalData()
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
                    <div className="flex flex-row justify-end mb-4">
                      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                          <IFRSGoalButton size="sm" className="flex items-center gap-1">
                            + 넷제로 목표 설정
                          </IFRSGoalButton>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>넷제로 목표 설정</DialogTitle>
                          </DialogHeader>
                          <NetZero onClose={handleNetZeroClose} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="p-2 bg-white border rounded-md border-emerald-100">
                      <Line data={chartData} />
                    </div>
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
