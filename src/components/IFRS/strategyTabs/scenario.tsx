import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import Analysis from './analysis/analysis'

export default function Scenario() {
  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div className="flex flex-row justify-start w-full">
        <Tabs defaultValue="none" className="w-full">
          <TabsList>
            <TabsTrigger value="analysis">분석 실행</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <Analysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
