'use client'

import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useRiskStore} from '@/stores/IFRS/strategy/useRiskStore'
import {riskApi} from '@/services/strategy'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function Risk({onClose}: MeetingProps) {
  const {
    riskType,
    riskCategory,
    riskCause,
    time,
    impact,
    financialImpact,
    businessModelImpact,
    plans,
    setField
  } = useRiskStore()

  const riskType2 = ['물리적 리스크', '전환 리스크', '기회 요인']
  const riskCategory2: Record<string, string[]> = {
    '물리적 리스크': ['정책 및 법률', '기술', '시장', '명성', '기타 추가'],
    '전환 리스크': ['급성', '만성'],
    '기회 요인': ['시장', '제품 및 서비스', '에너지원', '자원 효율성', '기타 추가']
  }
  const time2 = ['단기', '중기', '장기']
  const impact2 = ['1', '2', '3', '4', '5']
  const financialImpact2 = ['O', 'X']

  const handleSubmit = async () => {
    if (
      !riskType ||
      !riskCategory ||
      !riskCause ||
      !time ||
      !impact ||
      !financialImpact ||
      !businessModelImpact ||
      !plans
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const riskData = {
      riskType,
      riskCategory,
      riskCause,
      time,
      impact,
      financialImpact,
      businessModelImpact,
      plans
    }

    try {
      await riskApi(riskData)
      showSuccess('리스크 정보가 저장되었습니다.')
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
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="리스크 종류"
            options={riskType2}
            value={riskType}
            onValueChange={value => {
              setField('riskType', value)
              setField('riskCategory', '') // 선택 리스크 종류 바뀌면 유형 초기화
            }}
          />
          <InputBox
            label="리스크 요인 (예: 산불, 폭염 등)"
            value={riskCause}
            onChange={e => setField('riskCause', e.target.value)}
          />
          <CustomSelect
            placeholder="영향도"
            options={impact2}
            value={impact}
            onValueChange={value => setField('impact', value)}
          />
          <InputBox
            label="사업 모델 및 가치 사슬에 대한 영향"
            value={businessModelImpact}
            onChange={e => setField('businessModelImpact', e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          {riskType && (
            <CustomSelect
              placeholder="리스크 유형"
              options={riskCategory2[riskType] ?? []}
              value={riskCategory}
              onValueChange={value => setField('riskCategory', value)}
            />
          )}
          <CustomSelect
            placeholder="시점"
            options={time2}
            value={time}
            onValueChange={value => setField('time', value)}
          />
          <CustomSelect
            placeholder="잠재적 재무 영향"
            options={financialImpact2}
            value={financialImpact}
            onValueChange={value => setField('financialImpact', value)}
          />
          <InputBox
            label="내용 현황 및 계획"
            value={plans}
            onChange={e => setField('plans', e.target.value)}
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
