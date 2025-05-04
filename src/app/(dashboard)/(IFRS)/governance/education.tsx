'use client'

import React from 'react'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {educationApi} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'
import {format} from 'date-fns'
import {DatePickerForm} from '@/components/layout/datePicker'

type EducationProps = {
  onClose: () => void
}

export default function Education({onClose}: EducationProps) {
  const {educationTitle, educationDate, participantCount, content, setField} =
    useEducationStore()

  const [date, setDate] = React.useState<Date | undefined>(educationDate ?? undefined)

  React.useEffect(() => {
    if (educationDate) {
      setDate(educationDate)
    }
  }, [educationDate])

  const handleSubmit = async () => {
    if (!educationTitle || !educationDate || !participantCount || !content) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const educationData = {
      educationTitle: educationTitle.trim(),
      educationDate: format(educationDate, 'yyyy-MM-dd'),
      participantCount,
      content: content.trim()
    }

    try {
      await educationApi(educationData)
      showSuccess('환경 교육 정보가 성공적으로 저장되었습니다.')
      useEducationStore.getState().resetFields()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('education-storage')
      }
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
        label="교육 주요 내용 (예: 온실가스. 기후리스 대응 등)"
        value={content}
        onChange={e => setField('content', e.target.value)}
      />
      <DatePickerForm
        date={educationDate ?? undefined}
        onDateChange={d => setField('educationDate', d ?? null)} // 내부에선 null 처리해도 됨
        participantCount={participantCount}
        onCountChange={val => setField('participantCount', val)}
      />

      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
