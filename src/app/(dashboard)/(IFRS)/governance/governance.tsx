'use client'

import Committee from './committee'
import KPI from './kpi'
import Education from './education'
import Meeting from './meeting'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../components/ui/breadcrumb'
import {useState} from 'react'
import CollapsibleWindow from '@/components/collapsibleWindow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

export default function Governance() {
  const [openCommittee, setOpenCommittee] = useState(false)
  const [openMeeting, setOpenMeeting] = useState(false)
  const [openKPI, setOpenKPI] = useState(false)
  const [openEducation, setOpenEducation] = useState(false)

  const committeeHeader = [
    '위원회 이름',
    '구성원 이름 / 직책 / 소속',
    '기후 관련 역할 및 책임 설명'
  ]
  const meetingHeader = ['회의 날짜', '회의 제목', '주요 안건 및 의결 내용']
  const KPIHeader = ['경영진 이름', 'KPI명', '목표율/목표값', '달성률/달성값']
  const educationHeader = ['교육 일자', '참석자 수', '교육 제목', '교육 주요 내용']

  return (
    <div className="flex flex-col w-full h-full p-8">
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
              <BreadcrumbPage>거버넌스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>
      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2 rounded">
        <span className="text-xl font-bold">거버넌스</span>
      </div>
      {/* ============================================================================ */}
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">위원회 구성</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={committeeHeader}
                formContent={<Committee />}
                dialogTitle="위원회 및 조직 입력"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">회의 관리</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={meetingHeader}
                formContent={<Meeting />}
                dialogTitle="회의관리"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">경영진 KPI</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={KPIHeader}
                formContent={<KPI />}
                dialogTitle="경영진 KPI 입력"
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">환경 교육</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                headers={educationHeader}
                formContent={<Education />}
                dialogTitle="환경 교육 기록"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
