'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {AlertTriangle, Save, Trash, AlertCircle, Loader2} from 'lucide-react'
import {useRiskStore} from '@/stores/IFRS/strategy/useRiskStore'
import {createRisk, updateRisk, deleteRisk, fetchRiskList} from '@/services/strategy'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'

// UI 컴포넌트
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
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
import {CreateRiskDto, UpdateRiskDto} from '@/types/IFRS/strategy'

type RiskProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Risk({onClose, rowId, mode}: RiskProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
    '물리적 리스크': ['급성', '만성'],
    '전환 리스크': ['정책 및 법률', '기술', '시장', '명성', '기타 추가'],
    '기회 요인': ['시장', '제품 및 서비스', '에너지원', '자원 효율성', '기타 추가']
  }
  const time2 = ['단기', '중기', '장기']
  const impact2 = ['1', '2', '3', '4', '5']
  // const financialImpact2 = ['O', 'X']

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
        showSuccess('리스크 정보가 성공적으로 수정되었습니다.')
      } else {
        await createRisk(riskData)
        showSuccess('새로운 리스크가 성공적으로 등록되었습니다.')
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
      showSuccess('리스크가 성공적으로 삭제되었습니다.')

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
        <div className="p-2 mr-3 rounded-full bg-rose-50">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {isEditMode ? '리스크 정보 수정' : '새 리스크 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 리스크 정보를 수정합니다.'
              : '새로운 기후 관련 리스크/기회 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="riskType" className="text-sm font-medium">
              리스크 종류
            </Label>
            <Select
              value={riskType}
              onValueChange={value => {
                setField('riskType', value)
                setField('riskCategory', '')
              }}>
              <SelectTrigger id="riskType" className="focus-visible:ring-customG">
                <SelectValue placeholder="리스크 종류를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {riskType2.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="riskCategory" className="text-sm font-medium">
              리스크 유형
            </Label>
            <Select
              value={riskCategory}
              onValueChange={value => setField('riskCategory', value)}
              disabled={!riskType}>
              <SelectTrigger id="riskCategory" className="focus-visible:ring-customG">
                <SelectValue
                  placeholder={
                    !riskType
                      ? '리스크 종류를 먼저 선택하세요'
                      : '리스크 유형을 선택하세요'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {(riskCategory2[riskType] || []).map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="riskCause" className="text-sm font-medium">
            리스크 요인
          </Label>
          <div className="relative">
            <Input
              id="riskCause"
              placeholder="기후 변화로 인한 구체적인 요인을 입력하세요"
              value={riskCause}
              onChange={e => setField('riskCause', e.target.value)}
              className="border focus-visible:ring-customG"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="time" className="text-sm font-medium">
              시점
            </Label>
            <Select value={time} onValueChange={value => setField('time', value)}>
              <SelectTrigger id="time" className="focus-visible:ring-customG">
                <SelectValue placeholder="시점을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {time2.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="impact" className="text-sm font-medium">
              영향도 (1-5)
            </Label>
            <Select value={impact} onValueChange={value => setField('impact', value)}>
              <SelectTrigger id="impact" className="focus-visible:ring-customG">
                <SelectValue placeholder="영향도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {impact2.map(option => (
                  <SelectItem key={option} value={option}>
                    {`${option} ${
                      option === '1' ? '(매우 낮음)' : option === '5' ? '(매우 높음)' : ''
                    }`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="financialImpact" className="text-sm font-medium">
              재무 영향
            </Label>
            <Select
              value={financialImpact}
              onValueChange={value => setField('financialImpact', value)}>
              <SelectTrigger id="financialImpact" className="focus-visible:ring-customG">
                <SelectValue placeholder="재무 영향 여부" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="O">O (있음)</SelectItem>
                <SelectItem value="X">X (없음)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="businessModelImpact" className="text-sm font-medium">
            사업 모델 및 가치 사슬 영향
          </Label>
          <Textarea
            id="businessModelImpact"
            placeholder="이 리스크/기회가 사업 모델과 가치 사슬에 미치는 영향을 설명하세요."
            rows={3}
            value={businessModelImpact}
            onChange={e => setField('businessModelImpact', e.target.value)}
            className="border resize-none focus-visible:ring-customG"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="plans" className="text-sm font-medium">
            내용 현황 및 계획
          </Label>
          <Textarea
            id="plans"
            placeholder="리스크 대응 또는 기회 활용을 위한 현황과 계획을 상세히 기술하세요."
            rows={3}
            value={plans}
            onChange={e => setField('plans', e.target.value)}
            className="border resize-none focus-visible:ring-customG"
          />
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
                  리스크 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 리스크 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며,
                  모든 관련 데이터가 영구적으로 삭제됩니다.
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
