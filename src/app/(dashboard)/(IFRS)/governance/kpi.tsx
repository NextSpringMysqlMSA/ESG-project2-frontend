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
  row?: string[]
  rowId?: number
  mode: 'add' | 'edit'
}

export default function KPI({onClose, row, rowId, mode}: KPIProps) {
  const {
    executiveName,
    kpiName,
    targetValue,
    achievedValue,
    setField,
    setData,
    resetFields
  } = useKPIStore()

  const [kpiId, setKpiId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    console.log('[KPI] mode:', mode)
    console.log('[KPI] rowId:', rowId)
    console.log('[KPI] row:', row)

    if (mode === 'edit' && row && rowId != null) {
      console.log('[KPI] Edit mode: setting form fields')

      setKpiId(rowId)
      // 상태가 다를 때만 set
      if (executiveName !== row[0]) setField('executiveName', row[0])
      if (kpiName !== row[1]) setField('kpiName', row[1])
      if (targetValue !== row[2]) setField('targetValue', row[2])
      if (achievedValue !== row[3]) setField('achievedValue', row[3])
    } else {
      console.log('[KPI] Add mode or invalid data: resetting form')
      setKpiId(null)
    }
    // 의존성 배열 주의!
  }, [mode, rowId])

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
      if (mode === 'edit' && kpiId !== null) {
        console.log('[KPI] Submitting update for ID:', kpiId)
        const updateData: UpdateKpiDto = {...kpiData, id: kpiId}
        await updateKpi(kpiId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        console.log('[KPI] Creating new KPI')
        await createKpi(kpiData)
        showSuccess('저장되었습니다.')
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
    if (kpiId == null) {
      console.warn('[KPI] handleDelete: no kpiId set, aborting')
      return
    }

    try {
      setSubmitting(true)
      console.log('[KPI] Deleting KPI ID:', kpiId)
      await deleteKpi(kpiId)
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
