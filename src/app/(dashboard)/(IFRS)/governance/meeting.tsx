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
  fetchMeetingList,
  CreateMeetingDto,
  UpdateMeetingDto
} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {format} from 'date-fns'

type MeetingProps = {
  onClose: () => void
  // row?: string[] // 제거: API에서 직접 데이터를 가져오기 때문에 불필요
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Meeting({onClose, rowId, mode}: MeetingProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)

  const {
    meetingName,
    meetingDate,
    agenda,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage,
    initFromApi // API 데이터 초기화 함수 사용
  } = useMeetingStore()

  useEffect(() => {
    if (isEditMode && rowId !== undefined) {
      // 수정 모드: API에서 데이터 로드
      initFromApi(rowId)
    } else {
      // 추가 모드: 로컬 스토리지에서 데이터 로드
      initFromStorage()
    }

    // 언마운트 시 저장 (추가 모드인 경우만)
    return () => {
      if (!isEditMode) {
        persistToStorage()
      } else {
        resetFields() // 수정 모드일 때 상태 초기화
      }
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage, resetFields])

  const handleSubmit = async () => {
    if (!meetingName || !meetingDate || !agenda) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const meetingData: CreateMeetingDto = {
      meetingName: meetingName.trim(),
      meetingDate: format(meetingDate, 'yyyy-MM-dd'),
      agenda: agenda.trim()
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateMeetingDto = {...meetingData, id: rowId}
        await updateMeeting(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createMeeting(meetingData)
        showSuccess('저장되었습니다.')
        localStorage.removeItem('meeting-storage')
      }

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
          : '저장 실패: 서버 오류 발생'
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (rowId === undefined) return

    try {
      setSubmitting(true)
      await deleteMeeting(rowId)
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
          selected={meetingDate ?? undefined}
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
        {isEditMode && (
          <DashButton
            width="w-24"
            className="text-white bg-red-500 border-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={submitting}>
            삭제
          </DashButton>
        )}
        <DashButton width="w-24" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '저장 중...' : isEditMode ? '수정' : '저장'}
        </DashButton>
      </div>
    </div>
  )
}
