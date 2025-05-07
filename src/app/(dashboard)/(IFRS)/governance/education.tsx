'use client'

import React, {useEffect, useState} from 'react'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {
  createEducation,
  updateEducation,
  deleteEducation,
  fetchEducationList,
  CreateEducationDto,
  UpdateEducationDto
} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'
import {format} from 'date-fns'
import {DatePickerForm} from '@/components/layout/datePicker'
import axios from 'axios'

type EducationProps = {
  onClose: () => void
  row?: string[]
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Education({onClose, row, rowId, mode}: EducationProps) {
  const {
    data,
    educationTitle,
    educationDate,
    participantCount,
    content,
    setField,
    setData,
    resetFields
  } = useEducationStore()

  const [educationId, setEducationId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('[Education] mode:', mode)
    console.log('[Education] rowId:', rowId)

    if (mode === 'edit' && rowId != null) {
      const target = data.find(item => item.id === rowId)
      if (target) {
        console.log('[Education] target found:', target)
        setEducationId(rowId)
        setField('educationTitle', target.educationTitle)
        setField(
          'educationDate',
          target.educationDate ? new Date(target.educationDate) : null
        )
        setField('participantCount', target.participantCount)
        setField('content', target.content)
      } else {
        console.warn('[Education] No matching target found for rowId:', rowId)
      }
    } else {
      console.log('[Education] Add mode or rowId missing → reset')
      setEducationId(null)
    }
  }, [rowId, mode, data, setField, resetFields])

  const handleSubmit = async () => {
    if (!educationTitle || !educationDate || !participantCount || !content) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const educationData: CreateEducationDto = {
      educationTitle: educationTitle.trim(),
      educationDate: format(educationDate, 'yyyy-MM-dd'),
      participantCount,
      content: content.trim()
    }

    try {
      setSubmitting(true)

      if (mode === 'edit' && educationId !== null) {
        const updateData: UpdateEducationDto = {
          ...educationData,
          id: educationId
        }
        await updateEducation(educationId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createEducation(educationData)
        showSuccess('저장되었습니다.')
      }

      const updatedList = await fetchEducationList()
      setData(
        updatedList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
      )

      resetFields()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('education-storage')
      }
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err?.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!educationId) return

    try {
      setSubmitting(true)
      await deleteEducation(educationId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchEducationList()
      setData(
        updatedList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
      )

      resetFields()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('education-storage')
      }
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err?.response?.data?.message
          ? err.response.data.message
          : '삭제 실패'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <InputBox
        label="교육 제목 (예: 2025년 전사 환경교육)"
        value={educationTitle}
        onChange={e => setField('educationTitle', e.target.value)}
      />
      <DatePickerForm
        date={educationDate ?? undefined}
        onDateChange={d => setField('educationDate', d ?? null)}
        participantCount={participantCount}
        onCountChange={val => setField('participantCount', val)}
      />
      <InputBox
        label="교육 주요 내용 (예: 온실가스, 기후리스크 대응 등)"
        value={content}
        onChange={e => setField('content', e.target.value)}
      />

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
