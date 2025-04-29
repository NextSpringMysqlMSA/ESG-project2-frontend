import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import Committee from './governanceTabs/committee'
import KPI from './governanceTabs/kpi'
import Education from './governanceTabs/education'
import Meeting from './governanceTabs/meeting'

export default function Governance() {
  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
      <div className="flex flex-row px-4 mb-4">ESG 공시 &gt; IFRS S2</div>
      <div className="flex flex-row px-4 mb-4 space-x-4">
        <div className="flex flex-row items-center w-full gap-x-4">
          <span className="text-xl font-bold">IFRS S2</span>
          <span className="text-gray-500">TCFD</span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between w-full h-12 px-4 bg-white border border-b-2">
        <span className="text-xl font-bold">거버넌스</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 bg-white border">
        <Tabs defaultValue="committee" className="w-full">
          <TabsList>
            <TabsTrigger value="committee">위원회 구성</TabsTrigger>
            <TabsTrigger value="meeting">회의 관리</TabsTrigger>
            <TabsTrigger value="kpi">경영진 KPI</TabsTrigger>
            <TabsTrigger value="education">환경 교육</TabsTrigger>
          </TabsList>
          <TabsContent value="committee">
            <Committee />
          </TabsContent>
          <TabsContent value="meeting">
            <Meeting />
          </TabsContent>
          <TabsContent value="kpi">
            <KPI />
          </TabsContent>
          <TabsContent value="education">
            <Education />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
