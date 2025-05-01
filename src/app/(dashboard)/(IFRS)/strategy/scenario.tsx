'use client'

import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'

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
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-[50%] pr-2 space-y-4">
            <CustomSelect
              placeholder="행정구역 선택"
              options={regions}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <InputBox label="경도 (예: 126.97)" />
            <CustomSelect
              placeholder="온난화 수준"
              options={warming}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <CustomSelect
              placeholder="산업 분야"
              options={industry}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <InputBox label="분석 기준 연도 (예: 2030)" />
          </div>
          <div className="flex flex-col w-[50%] ml-2 space-y-4">
            <InputBox label="위도 (예: 37.56)" />
            <CustomSelect
              placeholder="SSP 시나리오"
              options={scenario}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <CustomSelect
              placeholder="기후 지표"
              options={climate}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <CustomSelect
              placeholder="자료 포맷"
              options={format}
              onValueChange={value => console.log('선택된 값:', value)}
            />
            <InputBox label="단위 피해 단가 (예: ₩/일 또는 ₩/mm)" />
          </div>
        </div>
        <InputBox label="대응 전략, 가정, 참고사항 입력 (예: RE100 전략, 저지대 배수로 개선 등)" />
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
