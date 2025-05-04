import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {committeeApi} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function Committee({onClose}: MeetingProps) {
  const {
    committeeName,
    memberName,
    memberPosition,
    memberAffiliation,
    climateResponsibility,
    setField
  } = useCommitteeStore()

  const handleSubmit = async () => {
    if (
      !committeeName ||
      !memberName ||
      !memberPosition ||
      !memberAffiliation ||
      !climateResponsibility
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const committeeData = {
      committeeName,
      memberName,
      memberPosition: memberPosition,
      memberAffiliation,
      climateResponsibility: climateResponsibility
    }

    try {
      // API 호출
      await committeeApi(committeeData)
      showSuccess('위원회 정보가 성공적으로 저장되었습니다.')
      useCommitteeStore.getState().resetFields()
      onClose()
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
        label="위원회 이름(예: ESG 위원회)"
        value={committeeName}
        onChange={e => setField('committeeName', e.target.value)}
      />
      <InputBox
        label="구성원 이름"
        value={memberName}
        onChange={e => setField('memberName', e.target.value)}
      />
      <InputBox
        label="구성원 직책"
        value={memberPosition}
        onChange={e => setField('memberPosition', e.target.value)}
      />
      <InputBox
        label="구성원 소속"
        value={memberAffiliation}
        onChange={e => setField('memberAffiliation', e.target.value)}
      />
      <InputBox
        label="기후 관련 역할 및 책임 설명"
        value={climateResponsibility}
        onChange={e => setField('climateResponsibility', e.target.value)}
      />
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
