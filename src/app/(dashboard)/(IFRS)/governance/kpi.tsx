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
    resetFields,
    persistToStorage,
    initFromStorage
  } = useKPIStore()

  const [kpiId, setKpiId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kpi-mode', mode)
    }

    if (mode === 'edit' && row && typeof rowId === 'number') {
      setKpiId(rowId)
      setField('executiveName', row[0])
      setField('kpiName', row[1])
      setField('targetValue', row[2])
      setField('achievedValue', row[3])
    } else if (mode === 'add') {
      setKpiId(null)
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
        const updateData: UpdateKpiDto = {...kpiData, id: kpiId}
        await updateKpi(kpiId, updateData)
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
    if (!kpiId) return

    try {
      setSubmitting(true)
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
