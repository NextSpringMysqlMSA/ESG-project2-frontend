'use client'

import {useEffect, useState} from 'react'
import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {
  createRisk,
  updateRisk,
  deleteRisk,
  fetchRiskById,
  fetchRiskList,
  CreateRiskDto,
  UpdateRiskDto
} from '@/services/strategy'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {useRiskStore} from '@/stores/IFRS/strategy/useRiskStore'

type RiskProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Risk({onClose, rowId, mode}: RiskProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)

  const {
    riskType,
    riskCategory,
    riskCause,
    time,
    impact,
    financialImpact,
    businessModelImpact,
    plans,
    setField,
    resetFields,
    initFromStorage,
    initFromApi,
    persistToStorage,
    setData
  } = useRiskStore()

  const riskType2 = ['물리적 리스크', '전환 리스크', '기회 요인']
  const riskCategory2: Record<string, string[]> = {
    '물리적 리스크': ['정책 및 법률', '기술', '시장', '명성', '기타 추가'],
    '전환 리스크': ['급성', '만성'],
    '기회 요인': ['시장', '제품 및 서비스', '에너지원', '자원 효율성', '기타 추가']
  }
  const time2 = ['단기', '중기', '장기']
  const impact2 = ['1', '2', '3', '4', '5']
  const financialImpact2 = ['O', 'X']

  useEffect(() => {
    if (isEditMode && rowId !== undefined) {
      // 수정 모드: API로부터 불러옴
      initFromApi(rowId)
    } else {
      // 추가 모드: 로컬스토리지 불러오기
      initFromStorage()
    }
    return () => {
      if (!isEditMode) persistToStorage()
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage])

  const handleSubmit = async () => {
    if (
      !riskType ||
      !riskCategory ||
      !riskCause ||
      !time ||
      !impact ||
      !financialImpact ||
      !businessModelImpact ||
      !plans
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    // DTO를 사용하여 데이터 준비
    const riskData: CreateRiskDto = {
      riskType,
      riskCategory,
      riskCause,
      time,
      impact,
      financialImpact,
      businessModelImpact,
      plans
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        // UpdateRiskDto를 사용하여 id 추가
        const updateData: UpdateRiskDto = {...riskData, id: rowId}
        await updateRisk(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createRisk(riskData)
        showSuccess('저장되었습니다.')
      }

      const updatedList = await fetchRiskList()
      setData(updatedList)

      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!rowId) return
    try {
      setSubmitting(true)
      await deleteRisk(rowId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchRiskList()
      setData(updatedList)

      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="리스크 종류"
            options={riskType2}
            value={riskType}
            onValueChange={value => {
              setField('riskType', value)
              setField('riskCategory', '')
            }}
          />
          <InputBox
            label="리스크 요인"
            value={riskCause}
            onChange={e => setField('riskCause', e.target.value)}
          />
          <CustomSelect
            placeholder="영향도"
            options={impact2}
            value={impact}
            onValueChange={value => setField('impact', value)}
          />
          <InputBox
            label="사업 모델 및 가치 사슬 영향"
            value={businessModelImpact}
            onChange={e => setField('businessModelImpact', e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          <CustomSelect
            placeholder="리스크 유형"
            options={riskCategory2[riskType] ?? []}
            value={riskCategory}
            onValueChange={value => setField('riskCategory', value)}
          />
          <CustomSelect
            placeholder="시점"
            options={time2}
            value={time}
            onValueChange={value => setField('time', value)}
          />
          <CustomSelect
            placeholder="재무 영향"
            options={financialImpact2}
            value={financialImpact}
            onValueChange={value => setField('financialImpact', value)}
          />
          <InputBox
            label="내용 현황 및 계획"
            value={plans}
            onChange={e => setField('plans', e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full gap-4">
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
