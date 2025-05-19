'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {BarChart, Save, Trash, AlertCircle, Loader2} from 'lucide-react'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {createKpi, updateKpi, deleteKpi, fetchKpiList} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'

// UI 컴포넌트
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {CreateKpiDto, UpdateKpiDto} from '@/types/IFRS/governance'

type KPIProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function KPI({onClose, rowId, mode}: KPIProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
    initFromApi
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
        showSuccess('KPI 정보가 성공적으로 수정되었습니다.')
      } else {
        await createKpi(kpiData)
        showSuccess('새 KPI가 성공적으로 등록되었습니다.')
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
          : '처리 실패: 서버 오류가 발생했습니다.'
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
      showSuccess('KPI가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchKpiList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col space-y-5">
      {/* 헤더 섹션 */}
      <div className="flex items-center pb-2 mb-2 border-b">
        <div className="p-2 mr-3 rounded-full bg-purple-50">
          <BarChart className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {isEditMode ? 'KPI 정보 수정' : '새 KPI 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 경영진 KPI 정보를 수정합니다.'
              : '새로운 경영진 KPI 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="executiveName" className="text-sm font-medium">
            경영진 이름
          </Label>
          <Input
            id="executiveName"
            placeholder="예: CEO 김ㅇㅇ, CFO 박ㅇㅇ"
            value={executiveName}
            onChange={e => setField('executiveName', e.target.value)}
            className="border focus-visible:ring-customG"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="kpiName" className="text-sm font-medium">
            KPI명
          </Label>
          <div className="relative">
            <Input
              id="kpiName"
              placeholder="예: 탄소배출량 감축률, 재생에너지 사용률"
              value={kpiName}
              onChange={e => setField('kpiName', e.target.value)}
              className="border focus-visible:ring-customG"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="targetValue" className="text-sm font-medium">
              목표율/목표값
            </Label>
            <div className="relative">
              <Input
                id="targetValue"
                placeholder="예: 10% 혹은 10000tCO2eq"
                value={targetValue}
                onChange={e => setField('targetValue', e.target.value)}
                className="border focus-visible:ring-customG"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="achievedValue" className="text-sm font-medium">
              달성률/달성값
            </Label>
            <div className="relative">
              <Input
                id="achievedValue"
                placeholder="예: 8% 혹은 8000tCO2eq"
                value={achievedValue}
                onChange={e => setField('achievedValue', e.target.value)}
                className="border focus-visible:ring-customG"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center justify-between pt-2 mt-2 space-x-3">
        {isEditMode && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="gap-1 text-red-600 bg-white border border-red-600 hover:bg-red-600 hover:text-white"
                disabled={submitting}>
                <Trash className="w-4 h-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  KPI 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 KPI를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 관련
                  데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    '삭제'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex flex-row items-center justify-end w-full space-x-3 ">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="gap-1">
            취소
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-1 text-white bg-customG hover:bg-customGDark">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? '저장하기' : '등록하기'}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
