'use client'

import {useState} from 'react'
import DashButton from '@/components/dashButton'
import InputBox from '@/components/inputBox'
import CustomSelect from '@/components/customSelect'

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
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="리스크 종류"
            options={riskType}
            onValueChange={value => setSelectedRiskType(value)}
          />
          <InputBox label="리스크 요인 (예: 산불, 폭염 등)" />
          <CustomSelect
            placeholder="영향도"
            options={impact}
            onValueChange={value => console.log('선택된 값:', value)}
          />
          <InputBox label="사업 모헙 및 가치 사슬에 대한 영향" />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          {selectedRiskType && (
            <CustomSelect
              placeholder="리스크 유형"
              options={riskCategory[selectedRiskType] ?? []}
              onValueChange={value => console.log('선택된 값:', value)}
            />
          )}
          <CustomSelect
            placeholder="시점"
            options={time}
            onValueChange={value => console.log('선택된 값:', value)}
          />
          <CustomSelect
            placeholder="잠재적 재무 영향"
            options={financialImpact}
            onValueChange={value => console.log('선택된 값:', value)}
          />
          <InputBox label="내용 현황 및 계획" />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
