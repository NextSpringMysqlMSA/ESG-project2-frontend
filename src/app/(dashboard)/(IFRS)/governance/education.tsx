import {DatePickerForm} from '@/components/layout/datePicker'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {educationApi} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function Education({onClose}: MeetingProps) {
  const {educationTitle, educationDate, participantCount, content, setField} =
    useEducationStore()

  const handleSubmit = async () => {
    if (!educationTitle || !educationDate || !participantCount || !content) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const educationData = {
      educationTitle,
      educationDate,
      participantCount,
      content
    }

    try {
      // API 호출
      await educationApi(educationData)
      showSuccess('위원회 정보가 성공적으로 저장되었습니다.')
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
        label="교육 제목 (예: 2025년 전사 환경교육)"
        value={educationTitle}
        onChange={e => setField('educationTitle', e.target.value)}
      />
      <InputBox
        label="일자 및 참석자 수 (예: 2025.03.15/900명)"
        value={participantCount}
        onChange={e => setField('participantCount', e.target.value)}
      />
      <InputBox
        label="교육 주요 내용 (예: 온실가스. 기후리스 대응 등)"
        value={content}
        onChange={e => setField('content', e.target.value)}
      />
      <DatePickerForm>
        <DashButton type="submit" width="w-26">
          + 교육 추가
        </DashButton>
      </DatePickerForm>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
