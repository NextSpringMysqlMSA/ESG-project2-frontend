'use client'

import {useState} from 'react'
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'
import {committeeApi, fetchCommitteeList} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'

type CommitteeProps = {
  onClose: () => void
}

export default function Committee({onClose}: CommitteeProps) {
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

  // 중복 제출 방지를 위한 상태 변수
  const [submitting, setSubmitting] = useState(false)

  // 저장 버튼 클릭 시 실행되는 함수
  const handleSubmit = async () => {
    // 이미 제출 중이라면 함수 종료
    if (submitting) return

    // 입력값 검증
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

    // 서버 전송 데이터 구성
    const committeeData = {
      committeeName,
      memberName,
      memberPosition,
      memberAffiliation,
      climateResponsibility
    }

    try {
      // 중복 방지 플래그 true 설정
      setSubmitting(true)

      // 저장 요청
      await committeeApi(committeeData)
      showSuccess('위원회 정보가 저장되었습니다.')

      // 최신 목록 다시 불러와서 상태 갱신
      const updatedList = await fetchCommitteeList()
      setData(updatedList)

      // 입력 초기화 및 모달 닫기
      resetFields()
      onClose()
    } catch (err: unknown) {
      let errorMessage = '저장 실패: 서버 오류가 발생했습니다.'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'data' in err.response &&
        typeof err.response.data === 'object' &&
        err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
      ) {
        errorMessage = err.response.data.message
      }

      showError(errorMessage)
    } finally {
      // 최종적으로 submitting 상태 해제
      setSubmitting(false)
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

      {/* 저장 버튼 */}
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '저장 중...' : '저장'}
        </DashButton>
      </div>
    </div>
  )
}
