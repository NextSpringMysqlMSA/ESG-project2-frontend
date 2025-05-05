import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {KPIApi, fetchKpiList} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function KPI({onClose}: MeetingProps) {
  const {executiveName, kpiName, targetValue, achievedValue, setField, setData} =
    useKPIStore()

  const handleSubmit = async () => {
    if (!executiveName || !kpiName || !targetValue || !achievedValue) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const kpiData = {
      executiveName,
      kpiName,
      targetValue: targetValue,
      achievedValue
    }

    try {
      // API 호출
      await KPIApi(kpiData)
      const updatedList = await fetchKpiList()
      setData(updatedList)
      showSuccess('경영진 KPI 정보가 성공적으로 저장되었습니다.')
      useKPIStore.getState().resetFields()

      onClose()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <InputBox
        label="경영진 이름 (예: CEO 김ㅇㅇ)"
        value={executiveName}
        onChange={e => setField('executiveName', e.target.value)}
      />
      <InputBox
        label="KPI명 (예: 탄소배출량 감축률)"
        value={kpiName}
        onChange={e => setField('kpiName', e.target.value)}
      />
      <InputBox
        label="목표율/목표값 (예: 10% 혹은 10000tCO2eq)"
        value={targetValue}
        onChange={e => setField('targetValue', e.target.value)}
      />
      <InputBox
        label="달성률/달성값 (예: 10% 혹은 10000tCO2eq)"
        value={achievedValue}
        onChange={e => setField('achievedValue', e.target.value)}
      />
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
