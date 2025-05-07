'use client'

import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useNetZeroStore} from '@/stores/IFRS/goal/useNetZeroStore'
import {createNetZero} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'
import DashButton from '@/components/tools/dashButton'

type MeetingProps = {
  onClose: () => void
}

export default function NetZero({onClose}: MeetingProps) {
  const industrialGroup2 = ['제조업', '금융업', 'ICT']
  const scenario2 = ['BAU', 'Aggressive', 'Conservative']

  const {
    industrialGroup,
    scenario,
    baseYear,
    midTargetYear,
    finalTargetYear,
    baseYearScope1,
    baseYearScope2,
    baseYearScope3,
    setField
  } = useNetZeroStore()

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
      // API 호출
      await createNetZero(netZeroData)
      // const updatedList = await fetchKPIGoal()
      // setData(updatedList)
      showSuccess('경영진 KPI 정보가 성공적으로 저장되었습니다.')
      useNetZeroStore.getState().resetFields()
      onClose()
    } catch (err: unknown) {
      let errorMessage = '저장 실패: 서버 오류가 발생했습니다.'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'data' in err.response &&
        typeof err.response.data === 'object' &&
        err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
      ) {
        errorMessage = err.response.data.message
      }
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col w-full h-full mt-4 space-y-4">
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="산업군"
            options={industrialGroup2}
            value={industrialGroup}
            onValueChange={value => setField('industrialGroup', value)}
          />
          <InputBox
            label="기준 년도"
            value={baseYear}
            onChange={e => setField('baseYear', e.target.value)}
          />
          <InputBox
            label="최종 목표 년도"
            value={finalTargetYear}
            onChange={e => setField('finalTargetYear', e.target.value)}
          />
          <InputBox
            label="기준연도 scope2 배출량(tCO₂e)"
            value={baseYearScope2}
            onChange={e => setField('baseYearScope2', e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          <CustomSelect
            placeholder="시나리오"
            options={scenario2}
            value={scenario}
            onValueChange={value => setField('scenario', value)}
          />
          <InputBox
            label="중간 목표 년도"
            value={midTargetYear}
            onChange={e => setField('midTargetYear', e.target.value)}
          />
          <InputBox
            label="기준연도 scope1 배출량(tCO₂e)"
            value={baseYearScope1}
            onChange={e => setField('baseYearScope1', e.target.value)}
          />
          <InputBox
            label="기준연도 scope3 배출량(tCO₂e)"
            value={baseYearScope3}
            onChange={e => setField('baseYearScope3', e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
