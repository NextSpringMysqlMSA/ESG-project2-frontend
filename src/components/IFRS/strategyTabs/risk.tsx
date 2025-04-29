'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {useState} from 'react'

export default function Risk() {
  const [selectedRiskType, setSelectedRiskType] = useState<
    keyof typeof riskCategory | ''
  >('')

  const riskType = ['물리적 리스크', '전환 리스크', '기회 요인']
  const riskCategory: Record<string, string[]> = {
    '물리적 리스크': ['정책 및 법률', '기술', '시장', '명성', '기타 추가'],
    '전환 리스크': ['급성', '만성'],
    '기회 요인': ['시장', '제품 및 서비스', '에너지원', '자원 효율성', '기타 추가']
  }
  const time = ['단기', '중기', '장기']
  const impact = ['1', '2', '3', '4', '5']
  const financialImpact = ['O', 'X']

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">리스크 식별 및 대응</span>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <Select onValueChange={value => setSelectedRiskType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="리스크 종류" />
            </SelectTrigger>
            <SelectContent>
              {riskType.map(riskType => (
                <SelectItem key={riskType} value={riskType}>
                  {riskType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            placeholder="리스크 요인 (예: 산불, 산사태, 폭염, 전기요금 상승 등)"
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="영향도" />
            </SelectTrigger>
            <SelectContent>
              {impact.map(impact => (
                <SelectItem key={impact} value={impact}>
                  {impact}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            placeholder="사업 모헙 및 가치 사슬에 대한 영향"
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          {selectedRiskType && (
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="리스크 유형" />
              </SelectTrigger>
              <SelectContent>
                {riskCategory[selectedRiskType]?.map(riskCategory => (
                  <SelectItem key={riskCategory} value={riskCategory}>
                    {riskCategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="시점" />
            </SelectTrigger>
            <SelectContent>
              {time.map(time => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="잠재적 재무 영향" />
            </SelectTrigger>
            <SelectContent>
              {financialImpact.map(financialImpact => (
                <SelectItem key={financialImpact} value={financialImpact}>
                  {financialImpact}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            placeholder="내용 현황 및 계획"
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"></input>
        </div>
      </div>
      <button className="flex items-center justify-center p-2 text-white rounded-xl w-36 bg-customG">
        + 리스크 항목 추가
      </button>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
