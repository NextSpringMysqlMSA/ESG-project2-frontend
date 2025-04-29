'use client'
import {useState} from 'react'
import Scenario from './strategyTabs/scenario'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../ui/tabs'

export default function Strategy() {
  const [open, setOpen] = useState(false)

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

      <div className="flex flex-row items-center justify-between w-full h-12 px-4 bg-white border border-b-2">
        <span className="text-xl font-bold">전략</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 bg-white border">
        <Tabs defaultValue="scenario" className="w-full">
          <TabsList>
            <TabsTrigger value="scenario">시나리오 분석</TabsTrigger>
            <TabsTrigger value="risk">물리/전환 리스크 및 기회요인</TabsTrigger>
          </TabsList>
          <TabsContent value="scenario">
            <Scenario />
          </TabsContent>
          <TabsContent value="risk"></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
