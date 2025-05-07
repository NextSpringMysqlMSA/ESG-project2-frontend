'use client'

import React, {useEffect, useState} from 'react'
import {Calendar} from '@/components/ui/calendar'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  fetchMeetingList
} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {format} from 'date-fns'

type MeetingProps = {
  onClose: () => void
  row?: string[] // [제목, 날짜, 안건]
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Meeting({onClose, row, rowId, mode}: MeetingProps) {
  const {meetingName, meetingDate, agenda, setField, setData, resetFields} =
    useMeetingStore()

  const [date, setDate] = useState<Date | undefined>(meetingDate ?? undefined)
  const [meetingId, setMeetingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('[Meeting] row:', row)
    if (mode === 'edit' && row && rowId !== undefined) {
      setMeetingId(rowId)
      setField('meetingDate', new Date(row[0])) // 날짜 → row[0]
      setField('meetingName', row[1]) // 제목 → row[1]
      setField('agenda', row[2]) // 안건 → row[2]
      setDate(new Date(row[0]))
    }
  }, [row, rowId, mode])

  const handleSubmit = async () => {
    if (!meetingName || !meetingDate || !agenda) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const meetingData = {
      meetingName: meetingName.trim(),
      meetingDate: format(meetingDate, 'yyyy-MM-dd'),
      agenda: agenda.trim()
    }

    try {
      setSubmitting(true)

      if (mode === 'edit' && meetingId !== null) {
        await updateMeeting(meetingId, {...meetingData, id: meetingId})
        showSuccess('수정되었습니다.')
      } else {
        await createMeeting(meetingData)
        showSuccess('저장되었습니다.')
      }

      const updatedList = await fetchMeetingList()
      const parsedList = updatedList.map(item => ({
        ...item,
        meetingDate: new Date(item.meetingDate)
      }))
      setData(parsedList)
      resetFields()
      setDate(undefined)
      onClose()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (meetingId === null) return

    try {
      setSubmitting(true)
      await deleteMeeting(meetingId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchMeetingList()
      const parsedList = updatedList.map(item => ({
        ...item,
        meetingDate: new Date(item.meetingDate)
      }))
      setData(parsedList)
      resetFields()
      setDate(undefined)
      onClose()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '삭제 실패'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
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
            setField('meetingDate', selectedDate ?? null)
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
      <div className="flex justify-center mt-4 space-x-4">
        {mode === 'edit' && (
          <DashButton
            width="w-24"
            className="text-white bg-red-500 border-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={submitting}>
            삭제
          </DashButton>
        )}
        <DashButton width="w-24" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '저장 중...' : mode === 'edit' ? '수정' : '저장'}
        </DashButton>
      </div>
    </div>
  )
}
