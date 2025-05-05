'use client'

import {useEffect, useState} from 'react'
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {committeeApi, deleteCommitteeItem, fetchCommitteeList} from '@/services/tcfd'
import {showError, showSuccess} from '@/util/toast'

type CommitteeProps = {
  onClose: () => void
  row?: string[]
  mode: 'add' | 'edit'
}

export default function Committee({onClose, row, mode}: CommitteeProps) {
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

    const committeeData = {
      committeeName,
      memberName,
      memberPosition,
      memberAffiliation,
      climateResponsibility
    }

    try {
      setSubmitting(true)
      await committeeApi(committeeData)
      showSuccess(mode === 'edit' ? '수정되었습니다.' : '저장되었습니다.')

      const updatedList = await fetchCommitteeList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || '서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!committeeName) return

    try {
      setSubmitting(true)
      await deleteCommitteeItem(committeeName)
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

  useEffect(() => {
    if (mode === 'edit' && row) {
      setField('committeeName', row[0])
      const [name, position, affiliation] = row[1].split(' / ')
      setField('memberName', name || '')
      setField('memberPosition', position || '')
      setField('memberAffiliation', affiliation || '')
      setField('climateResponsibility', row[2])
    } else {
      resetFields()
    }
  }, [row, mode])

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

      <div className="flex justify-center space-x-4">
        {mode === 'edit' && (
          <DashButton
            width="w-24"
            className="bg-red-500 hover:bg-red-600"
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
