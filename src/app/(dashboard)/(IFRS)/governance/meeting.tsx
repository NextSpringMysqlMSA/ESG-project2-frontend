'use client'

import {useEffect, useState} from 'react'
import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import {Calendar} from '@/components/ui/calendar'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  fetchMeetingList
} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {format} from 'date-fns'

type MeetingProps = {
  onClose: () => void
  row?: string[]
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Meeting({onClose, row, rowId, mode}: MeetingProps) {
  const {
    meetingName,
    meetingDate,
    agenda,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage
  } = useMeetingStore()

  const [meetingId, setMeetingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('meeting-mode', mode)
    }

    if (mode === 'edit' && row && typeof rowId === 'number') {
      setMeetingId(rowId)
      const parsedDate = new Date(row[0])
      setField('meetingDate', parsedDate)
      setField('meetingName', row[1])
      setField('agenda', row[2])
    } else if (mode === 'add') {
      setMeetingId(null)
      requestAnimationFrame(() => {
        initFromStorage()
      })
    }

    return () => {
      if (mode === 'add') {
        requestAnimationFrame(() => {
          persistToStorage()
        })
      } else {
        resetFields()
      }
    }
  }, [])

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
        localStorage.removeItem('meeting-storage')
        resetFields()
      }

      const updatedList = await fetchMeetingList()
      setData(
        updatedList.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
      )

      onClose()
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류 발생'
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (meetingId == null) return

    try {
      setSubmitting(true)
      await deleteMeeting(meetingId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchMeetingList()
      setData(
        updatedList.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
      )

      resetFields()
      onClose()
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류 발생'
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-row w-full space-x-4">
        <Calendar
          mode="single"
          selected={meetingDate ?? undefined} // ✅ 직접 Zustand 값 사용
          onSelect={d => setField('meetingDate', d ?? null)}
        />

        <div className="flex flex-col w-full h-full space-y-4">
          <InputBox
            label="회의 제목"
            value={meetingName}
            onChange={e => setField('meetingName', e.target.value)}
          />
          <textarea
            className="flex w-full h-full px-3 py-2 text-sm border rounded-md shadow-sm resize-none"
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
