import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import Analysis from './analysis'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function Scenario() {
  const regions = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '경기도',
    '강원특별자치도',
    '충청북도',
    '충청남도',
    '전북특별자치도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도'
  ]

  const warming = ['+1.5°C', '+2.0°C', '+3.0°C']

  const industry = [
    'ICT/통신',
    '에너지/전력',
    '물류/운송',
    '농업/식량',
    '건설/기반시설',
    '제조/공정'
  ]

  const scenario = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']

  const climate = [
    'TX90 (90th 백분위 고온일수)',
    'RX1D (1일 최대 강수량)',
    'WS90 (강풍일수, 상위 10%)',
    'TNx (연 최고기온)',
    'FD (결빙일수)',
    'D80 (80mm 초과 강수일)'
  ]

  const format = ['ASCill (텍스트 격자파일)', 'NetCDF (과학 격자자료)']

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">SSP 시나리오 분석</span>
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-[50%] pr-2 space-y-4">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="행정구역 선택" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(regions => (
                  <SelectItem key={regions} value={regions}>
                    {regions}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              placeholder="경도 (예: 126.97)"
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="온난화 수준" />
              </SelectTrigger>
              <SelectContent>
                {warming.map(warming => (
                  <SelectItem key={warming} value={warming}>
                    {warming}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="산업 분야" />
              </SelectTrigger>
              <SelectContent>
                {industry.map(industry => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              placeholder="분석 기준 연도 (예: 2030)"
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
          </div>
          <div className="flex flex-col w-[50%] ml-2 space-y-4">
            <input
              placeholder="위도 (예: 37.56)"
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="SSP 시나리오" />
              </SelectTrigger>
              <SelectContent>
                {scenario.map(scenario => (
                  <SelectItem key={scenario} value={scenario}>
                    {scenario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="기후 지표" />
              </SelectTrigger>
              <SelectContent>
                {climate.map(climate => (
                  <SelectItem key={climate} value={climate}>
                    {climate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="자료 포맷" />
              </SelectTrigger>
              <SelectContent>
                {format.map(format => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              placeholder="단위 피해 단가 (예: ₩/일 또는 ₩/mm)"
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
          </div>
        </div>
        <input
          placeholder="대응 전략, 가정, 참고사항 입력 (예: RE100 전략, 저지대 배수로 개선 등)"
          className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
      </div>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
