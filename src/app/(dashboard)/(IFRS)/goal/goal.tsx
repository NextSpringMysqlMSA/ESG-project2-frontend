import DashButton from '@/components/dashButton'
import InputBox from '@/components/inputBox'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

export default function Goal() {
  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
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
      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2">
        <span className="text-xl font-bold">목표 및 지표</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 bg-white border">
        <Tabs defaultValue="netZero" className="w-full">
          <TabsList>
            <TabsTrigger value="netZero">넷제로 목표 시뮬레이션</TabsTrigger>
            <TabsTrigger value="kpiGoal">KPI 목표 설정</TabsTrigger>
          </TabsList>
          <TabsContent value="netZero"></TabsContent>
          <TabsContent value="kpiGoal"></TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
