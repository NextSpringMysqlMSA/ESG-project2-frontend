'use client'

import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useScenarioStore} from '@/stores/IFRS/strategy/useScenarioStore'
import {createScenario} from '@/services/strategy'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function Scenario({onClose}: MeetingProps) {
  const regions2 = [
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
  const warming2 = ['+1.5°C', '+2.0°C', '+3.0°C']

  const industry2 = [
    'ICT/통신',
    '에너지/전력',
    '물류/운송',
    '농업/식량',
    '건설/기반시설',
    '제조/공정'
  ]
  const scenario2 = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']

  const climate2 = [
    'TX90 (90th 백분위 고온일수)',
    'RX1D (1일 최대 강수량)',
    'WS90 (강풍일수, 상위 10%)',
    'TNx (연 최고기온)',
    'FD (결빙일수)',
    'D80 (80mm 초과 강수일)'
  ]
  const format2 = ['ASCill (텍스트 격자파일)', 'NetCDF (과학 격자자료)']

  const {
    regions,
    longitude,
    latitude,
    warming,
    industry,
    scenario,
    baseYear,
    climate,
    damage,
    format,
    responseStrategy,
    setField
  } = useScenarioStore()

  const handleSubmit = async () => {
    if (
      !regions ||
      !longitude ||
      !latitude ||
      !warming ||
      !industry ||
      !scenario ||
      !baseYear ||
      !climate ||
      !damage ||
      !format ||
      !responseStrategy
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    try {
      await createScenario({
        regions,
        longitude,
        latitude,
        warming,
        industry,
        scenario,
        baseYear,
        climate,
        damage,
        format,
        responseStrategy
      })
      showSuccess('시나리오 정보가 저장되었습니다.')
      onClose()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    }
  }
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-[50%] pr-2 space-y-4">
            <CustomSelect
              placeholder="행정구역 선택"
              options={regions2}
              value={regions}
              onValueChange={value => setField('regions', value)}
            />
            <InputBox
              label="경도 (예: 126.97)"
              value={longitude}
              onChange={e => setField('longitude', parseFloat(e.target.value))}
            />
            <CustomSelect
              placeholder="온난화 수준"
              options={warming2}
              value={warming}
              onValueChange={value => setField('warming', value)}
            />
            <CustomSelect
              placeholder="산업 분야"
              options={industry2}
              value={industry}
              onValueChange={value => setField('industry', value)}
            />
            <InputBox
              label="분석 기준 연도 (예: 2030)"
              value={baseYear}
              onChange={e => setField('baseYear', parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-col w-[50%] ml-2 space-y-4">
            <InputBox
              label="위도 (예: 37.56)"
              value={latitude}
              onChange={e => setField('latitude', parseFloat(e.target.value))}
            />
            <CustomSelect
              placeholder="SSP 시나리오"
              options={scenario2}
              value={scenario}
              onValueChange={value => setField('scenario', value)}
            />
            <CustomSelect
              placeholder="기후 지표"
              options={climate2}
              value={climate}
              onValueChange={value => setField('climate', value)}
            />
            <CustomSelect
              placeholder="자료 포맷"
              options={format2}
              value={format}
              onValueChange={value => setField('format', value)}
            />
            <InputBox
              label="단위 피해(예: ₩/일 또는 ₩/mm)"
              value={isNaN(damage) ? '' : damage}
              onChange={e => setField('damage', parseFloat(e.target.value))}
            />
          </div>
        </div>
        <InputBox
          label="대응 전략, 가정, 참고사항 입력 (예: RE100 전략, 저지대 배수로 개선 등)"
          value={responseStrategy}
          onChange={e => setField('responseStrategy', e.target.value)}
        />
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
