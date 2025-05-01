import Scenario from './scenario'
import Risk from './risk'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import CollapsibleWindow from '@/components/collapsibleWindow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

export default function Strategy() {
  const scenarioHeader = [
    '행정구역',
    '시나리오',
    'GWL',
    '위도/경도',
    '지표',
    '변화량',
    '단가',
    '예상 피해액',
    '전략권고'
  ]
  const riskHeader = [
    '리스크 종류',
    '리스크 요인',
    '영향도',
    '사업 모헙 및 가치 사슬에 대한 영향',
    '시점',
    '잠재적 재무 영향',
    '내용 현황 및 계획'
  ]

  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
      {/* Breadcrumb 부분 ======================================================================================*/}
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
              <BreadcrumbPage>전략</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>

      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2">
        <span className="text-xl font-bold">전략</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 bg-white border">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              SSP 시나리오 분석 결과
            </AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={scenarioHeader}
                formContent={<Scenario />}
                dialogTitle="SSP 시나리오 분석"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              물리/전환 리스크 및 기회요인
            </AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={riskHeader}
                formContent={<Risk />}
                dialogTitle="리스크 식별 및 대응"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
