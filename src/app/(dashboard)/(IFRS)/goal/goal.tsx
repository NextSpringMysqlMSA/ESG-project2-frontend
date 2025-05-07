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
  LineElement // LineElement 임포트
} from 'chart.js'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {useState} from 'react'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
) // LineElement 등록

export default function Goal() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const data = {
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
                    <NetZero
                      onClose={function (): void {
                        throw new Error('Function not implemented.')
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <Line data={data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">KPI 목표</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={kpiGoalHeader}
                formContent={({onClose}) => <KPIGoal onClose={onClose} />}
                dialogTitle="KPI 목표 설정"
                data={[]} // 빈 배열로 기본값 명시
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
