import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

export default function Scenario() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row justify-start w-full">
        <Tabs>
          <TabsList>
            <TabsTrigger value="analysis">분석 실행</TabsTrigger>
          </TabsList>
          <TabsContent value="analysis"></TabsContent>
        </Tabs>
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
