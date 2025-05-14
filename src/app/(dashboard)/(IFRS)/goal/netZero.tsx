'use client'

import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useNetZeroStore} from '@/stores/IFRS/goal/useNetZeroStore'
import {createNetZero} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'
import DashButton from '@/components/tools/dashButton'
import axios from 'axios'

type NetZeroProps = {
  onClose: () => void
}

export default function NetZero({onClose}: NetZeroProps) {
  const industrialGroupOptions = ['제조업', '금융업', 'ICT']
  const scenarioOptions = ['BAU', 'Aggressive', 'Conservative']

  const {
    industrialGroup,
    scenario,
    baseYear,
    midTargetYear,
    finalTargetYear,
    baseYearScope1,
    baseYearScope2,
    baseYearScope3,
    setField,
    resetFields
  } = useNetZeroStore()

  const handleNumberChange = (field: string, value: string) => {
    const parsed = parseInt(value, 10)
    setField(field as any, isNaN(parsed) ? '' : parsed)
  }

  const handleSubmit = async () => {
    if (
      !industrialGroup ||
      !scenario ||
      !baseYear ||
      !midTargetYear ||
      !finalTargetYear ||
      !baseYearScope1 ||
      !baseYearScope2 ||
      !baseYearScope3
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const netZeroData = {
      industrialGroup,
      scenario,
      baseYear,
      midTargetYear,
      finalTargetYear,
      baseYearScope1,
      baseYearScope2,
      baseYearScope3
    }

    try {
      await createNetZero(netZeroData)
      showSuccess('넷제로 목표가 성공적으로 저장되었습니다.')
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err?.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col w-full h-full mt-4 space-y-4">
      <div className="flex flex-row w-full">
        {/* 왼쪽 컬럼 */}
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="산업군"
            options={industrialGroupOptions}
            value={industrialGroup}
            onValueChange={value => setField('industrialGroup', value)}
          />
          <InputBox
            label="기준 년도"
            value={baseYear}
            onChange={e => handleNumberChange('baseYear', e.target.value)}
          />
          <InputBox
            label="최종 목표 년도"
            value={finalTargetYear}
            onChange={e => handleNumberChange('finalTargetYear', e.target.value)}
          />
          <InputBox
            label="기준연도 Scope2 배출량(tCO₂e)"
            value={baseYearScope2}
            onChange={e => handleNumberChange('baseYearScope2', e.target.value)}
          />
        </div>

        {/* 오른쪽 컬럼 */}
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          <CustomSelect
            placeholder="시나리오"
            options={scenarioOptions}
            value={scenario}
            onValueChange={value => setField('scenario', value)}
          />
          <InputBox
            label="중간 목표 년도"
            value={midTargetYear}
            onChange={e => handleNumberChange('midTargetYear', e.target.value)}
          />
          <InputBox
            label="기준연도 Scope1 배출량(tCO₂e)"
            value={baseYearScope1}
            onChange={e => handleNumberChange('baseYearScope1', e.target.value)}
          />
          <InputBox
            label="기준연도 Scope3 배출량(tCO₂e)"
            value={baseYearScope3}
            onChange={e => handleNumberChange('baseYearScope3', e.target.value)}
          />
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
