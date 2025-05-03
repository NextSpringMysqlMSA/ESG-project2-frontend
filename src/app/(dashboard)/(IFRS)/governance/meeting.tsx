'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'
import {useState} from 'react'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {meetingApi} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'

type MeetingProps = {
  onClose: () => void
}

export default function Meeting({onClose}: MeetingProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const {meetingName, meetingDate, agenda, setField} = useMeetingStore()

  const handleSubmit = async () => {
    if (!meetingName || !meetingDate || !agenda) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const meetingData = {
      meetingName,
      meetingDate: meetingDate,
      agenda
    }

    try {
      // API 호출
      await meetingApi(meetingData)
      showSuccess('위원회 정보가 성공적으로 저장되었습니다.')
      onClose() // 성공 후 이동할 페이지
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-row w-full space-x-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={selectedDate => {
            setDate(selectedDate)
            setField('meetingDate', selectedDate?.toISOString() ?? '')
          }}
        />
        <div className="flex flex-col w-full h-full space-y-4">
          <InputBox
            label="회의 제목"
            value={meetingName}
            onChange={e => setField('meetingName', e.target.value)}
          />
          <textarea
            className="flex items-center justify-between w-full h-full px-3 py-2 text-sm bg-transparent border rounded-md shadow-sm whitespace-nowrap border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="주요 안건 및 의결 내용 입력"
            value={agenda}
            onChange={e => setField('agenda', e.target.value)}
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
