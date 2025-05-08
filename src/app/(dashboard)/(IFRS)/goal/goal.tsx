'use client'

import KPIGoal from './kpiGoal'
import NetZero from './netZero'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
        item.goalYear.toString(),
        item.baseYear.toString(),
        item.referenceValue.toString(),
        item.targetValue.toString(),
        item.currentValue.toString()
      ]
    }))
  }

  const handleNetZeroClose = () => {
    setIsAddOpen(false)
  }

  return (
    <div className="flex flex-col w-full h-full p-8">
      {/* Breadcrumb ===================================================================================== */}
      <div className="flex flex-row px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/official">ESG 공시</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/official">IFRS S2</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>목표 및 지표</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Title ===================================================================================== */}
      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>
      {/* Subtitle ===================================================================================== */}
      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2 rounded">
        <span className="text-xl font-bold">목표 및 지표</span>
      </div>
      {/* Accordion Items ===================================================================================== */}
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">넷제로 분석 결과</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row justify-end">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center justify-center p-2 text-white transition-all duration-200 border w-36 bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG">
                      + 넷제로 목표 설정
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>넷제로 목표 설정</DialogTitle>
                    </DialogHeader>
                    <NetZero onClose={handleNetZeroClose} />
                  </DialogContent>
                </Dialog>
              </div>
              <Line data={chartData} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">KPI 목표</AccordionTrigger>
            <AccordionContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-customG"></div>
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
    </div>
  )
}
