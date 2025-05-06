'use client'

import {useEffect, useState} from 'react'
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {fetchCommitteeById} from '@/services/tcfd' // 데이터 불러오는 함수
import {
  createCommittee,
  updateCommittee,
  deleteCommittee,
  fetchCommitteeList
} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'
import {CreateCommitteeDto, UpdateCommitteeDto} from '@/services/tcfd'

type CommitteeProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Committee({onClose, rowId, mode}: CommitteeProps) {
  const {
    committeeName,
    memberName,
    memberPosition,
    memberAffiliation,
    climateResponsibility,
    setField,
    resetFields,
    setData
  } = useCommitteeStore()

  const [submitting, setSubmitting] = useState(false)
  const [committeeId, setCommitteeId] = useState<number | null>(null)

  // rowId가 있을 때만 데이터를 불러오는 useEffect
  useEffect(() => {
    if (mode === 'edit' && rowId !== undefined) {
      const loadData = async () => {
        try {
          const committeeData = await fetchCommitteeById(rowId) // 데이터를 불러옵니다
          setCommitteeId(committeeData.id) // 불러온 데이터의 ID 설정
          setField('committeeName', committeeData.committeeName)
          setField('memberName', committeeData.memberName)
          setField('memberPosition', committeeData.memberPosition)
          setField('memberAffiliation', committeeData.memberAffiliation)
          setField('climateResponsibility', committeeData.climateResponsibility)
        } catch (error) {
          console.error('데이터를 불러오는 데 실패했습니다:', error)
          showError('데이터를 불러오는 데 실패했습니다.')
        }
      }

      loadData()
    } else {
      resetFields() // 'add' 모드일 경우 입력 필드 초기화
    }
  }, [rowId, mode, setField, resetFields]) // rowId와 mode가 변경될 때 실행

  const handleSubmit = async () => {
    if (submitting) return

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

    const committeeData: CreateCommitteeDto = {
      committeeName,
      memberName,
      memberPosition,
      memberAffiliation,
      climateResponsibility
    }

    try {
      setSubmitting(true)

      if (mode === 'edit' && committeeId !== null) {
        const updateData: UpdateCommitteeDto = {...committeeData, id: committeeId}
        await updateCommittee(committeeId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createCommittee(committeeData)
        showSuccess('저장되었습니다.')
      }

      const updatedList = await fetchCommitteeList()
      setData(updatedList)
      resetFields()
      if (typeof window !== 'undefined') {
        localStorage.removeItem('committee-storage')
      }

      onClose()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (committeeId === null) return

    try {
      setSubmitting(true)
      await deleteCommittee(committeeId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchCommitteeList()
      setData(updatedList)
      resetFields()
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
      <InputBox
        label="위원회 이름"
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
