'use client'
import {useState} from 'react'
import Arrow from '../svg/arrow'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function Strategy() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8 space-y-4">
      {/* Breadcrumb 부분 */}
      <div className="flex flex-row px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/official">ESG 공시</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>IFRS S2</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row px-4 space-x-4">
        <div className="flex flex-row items-center w-full gap-x-4">
          <span className="text-xl font-bold">IFRS S2</span>
          <span className="text-gray-500">TCFD</span>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-full h-12 px-4 bg-white border">
        <span>전략</span>
        <button
          onClick={() => setOpen(!open)}
          className="hover:bg-[#1890FF] hover:text-white rounded border-2">
          <Arrow open={open} />
        </button>
      </div>

      <div className="flex flex-col w-full px-4 bg-white border">
        분석 결과
        <table className="w-full text-center border-b-2 table-fixed border-b-black">
          <thead>
            <tr>
              <th>행정구역</th>
              <th>시나리오</th>
              <th>GWL</th>
              <th>위도/경도</th>
              <th>지표</th>
              <th>변화량</th>
              <th>단가</th>
              <th>예상 피해액</th>
              <th>전략권고</th>
            </tr>
          </thead>
        </table>
        <div className="flex flex-row w-full bg-white">hello</div>
      </div>
    </div>
  )
}
