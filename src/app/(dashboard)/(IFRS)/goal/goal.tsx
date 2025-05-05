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

export default function Goal() {
  const netZeroHeader = ['']
  const kpiGoalHeader = ['']
  return (
    <div className="flex flex-col w-full h-full p-8">
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
      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>
      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2 rounded">
        <span className="text-xl font-bold">목표 및 지표</span>
      </div>
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">넷제로 분석 결과</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={netZeroHeader}
                formContent={({onClose}) => <NetZero onClose={onClose} />}
                dialogTitle="넷제로 분석 설정"
                data={[]} // 빈 배열로 기본값 명시
              />
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
