'use client'

import {useEffect, useState} from 'react'
import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {
  createKpi,
  updateKpi,
  deleteKpi,
  fetchKpiList,
  CreateKpiDto,
  UpdateKpiDto
} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'

type KPIProps = {
  onClose: () => void
  // row?: string[] // 제거: API에서 직접 데이터를 가져오기 때문에 불필요
  rowId?: number
  mode: 'add' | 'edit'
}

export default function KPI({onClose, rowId, mode}: KPIProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)

  const {
    executiveName,
    kpiName,
    targetValue,
    achievedValue,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage,
    initFromApi // 새로 추가된 API 호출 함수
  } = useKPIStore()

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
    if (!executiveName || !kpiName || !targetValue || !achievedValue) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const kpiData: CreateKpiDto = {
      executiveName: executiveName.trim(),
      kpiName: kpiName.trim(),
      targetValue: targetValue.trim(),
      achievedValue: achievedValue.trim()
    }

    try {
      setSubmitting(true)
      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateKpiDto = {...kpiData, id: rowId}
        await updateKpi(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createKpi(kpiData)
        showSuccess('저장되었습니다.')
        localStorage.removeItem('kpi-storage')
      }

      const updatedList = await fetchKpiList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (rowId === undefined) return

    try {
      setSubmitting(true)
      await deleteKpi(rowId)
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchKpiList()
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
      <InputBox
        label="경영진 이름 (예: CEO 김ㅇㅇ)"
        value={executiveName}
        onChange={e => setField('executiveName', e.target.value)}
      />
      <InputBox
        label="KPI명 (예: 탄소배출량 감축률)"
        value={kpiName}
        onChange={e => setField('kpiName', e.target.value)}
      />
      <InputBox
        label="목표율/목표값 (예: 10% 혹은 10000tCO2eq)"
        value={targetValue}
        onChange={e => setField('targetValue', e.target.value)}
      />
      <InputBox
        label="달성률/달성값 (예: 10% 혹은 10000tCO2eq)"
        value={achievedValue}
        onChange={e => setField('achievedValue', e.target.value)}
      />

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
