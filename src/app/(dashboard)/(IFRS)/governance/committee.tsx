'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {Users, Save, Trash, AlertCircle, Loader2} from 'lucide-react'
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import {
  createCommittee,
  updateCommittee,
  deleteCommittee,
  fetchCommitteeList
} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Button} from '@/components/ui/button'
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
import {CreateCommitteeDto, UpdateCommitteeDto} from '@/types/IFRS/governance'

type CommitteeProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Committee({onClose, rowId, mode}: CommitteeProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    committeeName,
    memberName,
    memberPosition,
    memberAffiliation,
    climateResponsibility,
    setField,
    resetFields,
    setData,
    persistToStorage,
    initFromStorage,
    initFromApi
  } = useCommitteeStore()

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
      }
      resetFields()
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage, resetFields])

  const validateForm = () => {
    if (
      !committeeName ||
      !memberName ||
      !memberPosition ||
      !memberAffiliation ||
      !climateResponsibility
    ) {
      showError('모든 필드를 채워주세요.')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!validateForm()) return

    const committeeData: CreateCommitteeDto = {
      committeeName,
      memberName,
      memberPosition,
      memberAffiliation,
      climateResponsibility
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateCommitteeDto = {...committeeData, id: rowId}
        await updateCommittee(rowId, updateData)
        showSuccess('위원회 정보가 성공적으로 수정되었습니다.')
      } else {
        await createCommittee(committeeData)
        showSuccess('새 위원회가 성공적으로 등록되었습니다.')

        localStorage.removeItem('committee-storage')
        resetFields()
      }

      const updatedList = await fetchCommitteeList()
      setData(updatedList)
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
      await deleteCommittee(rowId)
      showSuccess('위원회가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchCommitteeList()
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
        <div className="p-2 mr-3 rounded-full bg-blue-50">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {isEditMode ? '위원회 정보 수정' : '새 위원회 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 위원회 정보를 수정합니다.'
              : '새로운 위원회와 구성원 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="committeeName" className="text-sm font-medium">
            위원회 이름
          </Label>
          <Input
            id="committeeName"
            placeholder="예: ESG 위원회, 지속가능경영위원회"
            value={committeeName}
            onChange={e => setField('committeeName', e.target.value)}
            className="border focus-visible:ring-customG"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="memberName" className="text-sm font-medium">
              구성원 이름
            </Label>
            <Input
              id="memberName"
              placeholder="이름"
              value={memberName}
              onChange={e => setField('memberName', e.target.value)}
              className="border focus-visible:ring-customG"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="memberPosition" className="text-sm font-medium">
              구성원 직책
            </Label>
            <Input
              id="memberPosition"
              placeholder="직책"
              value={memberPosition}
              onChange={e => setField('memberPosition', e.target.value)}
              className="border focus-visible:ring-customG"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="memberAffiliation" className="text-sm font-medium">
              구성원 소속
            </Label>
            <Input
              id="memberAffiliation"
              placeholder="소속"
              value={memberAffiliation}
              onChange={e => setField('memberAffiliation', e.target.value)}
              className="border focus-visible:ring-customG"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="climateResponsibility" className="text-sm font-medium">
            기후 관련 역할 및 책임 설명
          </Label>
          <Textarea
            id="climateResponsibility"
            placeholder="위원회 및 구성원의 기후 관련 역할과 책임에 대해 상세히 설명해주세요."
            rows={4}
            value={climateResponsibility}
            onChange={e => setField('climateResponsibility', e.target.value)}
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
                  위원회 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 위원회를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
                  관련 데이터가 영구적으로 삭제됩니다.
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
