'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {
  GraduationCap,
  Save,
  Trash,
  AlertCircle,
  Loader2,
  CalendarDays,
  Users
} from 'lucide-react'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {
  createEducation,
  updateEducation,
  deleteEducation,
  fetchEducationList
} from '@/services/governance'
import {showError, showSuccess} from '@/util/toast'
import {format} from 'date-fns'
import axios from 'axios'

// UI 컴포넌트
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Textarea} from '@/components/ui/textarea'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
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
import {CreateEducationDto, UpdateEducationDto} from '@/types/IFRS/governance'

type EducationProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Education({onClose, rowId, mode}: EducationProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    educationTitle,
    educationDate,
    participantCount,
    content,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage,
    initFromApi
  } = useEducationStore()

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
        resetFields() // 수정 모드일 때만 상태 초기화
      }
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage, resetFields])

  const handleSubmit = async () => {
    if (!educationTitle || !educationDate || !participantCount || !content) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const educationData: CreateEducationDto = {
      educationTitle: educationTitle.trim(),
      educationDate: format(educationDate, 'yyyy-MM-dd'),
      participantCount,
      content: content.trim()
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateEducationDto = {
          ...educationData,
          id: rowId
        }
        await updateEducation(rowId, updateData)
        showSuccess('교육 정보가 성공적으로 수정되었습니다.')
      } else {
        await createEducation(educationData)
        showSuccess('새 교육이 성공적으로 등록되었습니다.')
        localStorage.removeItem('education-storage')
      }

      const updatedList = await fetchEducationList()
      setData(
        updatedList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
      )

      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err?.response?.data?.message
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
      await deleteEducation(rowId)
      showSuccess('교육 정보가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchEducationList()
      setData(
        updatedList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
      )

      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err?.response?.data?.message
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
        <div className="p-2 mr-3 rounded-full bg-amber-50">
          <GraduationCap className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {isEditMode ? '교육 정보 수정' : '새 교육 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 교육 정보를 수정합니다.'
              : '새로운 환경 교육 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="educationTitle" className="text-sm font-medium">
            교육 제목
          </Label>
          <Input
            id="educationTitle"
            placeholder="예: 2025년 전사 환경교육"
            value={educationTitle}
            onChange={e => setField('educationTitle', e.target.value)}
            className="border focus-visible:ring-customG"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="educationDate" className="text-sm font-medium">
              교육 일자
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="educationDate"
                  variant={'outline'}
                  className={`w-full justify-start text-left font-normal focus-visible:ring-customG ${
                    !educationDate && 'text-gray-400'
                  }`}>
                  <CalendarDays className="w-4 h-4 mr-2 text-customG" />
                  {educationDate
                    ? format(educationDate, 'yyyy년 MM월 dd일')
                    : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={educationDate || undefined}
                  onSelect={date => {
                    // 날짜가 null이거나 undefined일 경우 기본 날짜를 설정하거나 무시
                    if (date) {
                      setField('educationDate', date)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="participantCount" className="text-sm font-medium">
              참석자 수
            </Label>
            <div className="flex items-center">
              <Input
                id="participantCount"
                type="number"
                min={1}
                placeholder="예: 25"
                value={participantCount === 0 ? '' : participantCount}
                onChange={e => {
                  const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10)
                  setField('participantCount', value)
                }}
                className="border focus-visible:ring-customG"
              />
              <div className="flex items-center ml-2 text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">명</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content" className="text-sm font-medium">
            교육 주요 내용
          </Label>
          <Textarea
            id="content"
            placeholder="온실가스, 기후리스크 대응 등 교육의 주요 내용을 상세히 기록해주세요."
            rows={4}
            value={content}
            onChange={e => setField('content', e.target.value)}
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
                  교육 정보 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 교육 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
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
