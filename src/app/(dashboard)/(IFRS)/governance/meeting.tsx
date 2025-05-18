'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {CalendarDays, Save, Trash, AlertCircle, Loader2} from 'lucide-react'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  fetchMeetingList
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
import {CreateMeetingDto, UpdateMeetingDto} from '@/types/IFRS/governance'

type MeetingProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Meeting({onClose, rowId, mode}: MeetingProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    meetingName,
    meetingDate,
    agenda,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage,
    initFromApi
  } = useMeetingStore()

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
    if (!meetingName || !meetingDate || !agenda) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const meetingData: CreateMeetingDto = {
      meetingName: meetingName.trim(),
      meetingDate: format(meetingDate, 'yyyy-MM-dd'),
      agenda: agenda.trim()
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateMeetingDto = {...meetingData, id: rowId}
        await updateMeeting(rowId, updateData)
        showSuccess('회의 정보가 성공적으로 수정되었습니다.')
      } else {
        await createMeeting(meetingData)
        showSuccess('새 회의가 성공적으로 등록되었습니다.')
        localStorage.removeItem('meeting-storage')
      }

      const updatedList = await fetchMeetingList()
      setData(
        updatedList.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
      )

      resetFields()
      onClose()
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '처리 실패: 서버 오류가 발생했습니다.'
      showError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (rowId === undefined) return

    try {
      setSubmitting(true)
      await deleteMeeting(rowId)
      showSuccess('회의가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchMeetingList()
      setData(
        updatedList.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
      )

      resetFields()
      onClose()
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류가 발생했습니다.'
      showError(message)
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
        <div className="p-2 mr-3 rounded-full bg-customGLight">
          <CalendarDays className="w-5 h-5 text-customG" />
        </div>
        <div>
          <h3 className="text-base font-medium">
            {isEditMode ? '회의 정보 수정' : '새 회의 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 회의 정보를 수정합니다.'
              : '새로운 회의와 안건 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}
      <div className="grid gap-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="meetingDate" className="text-sm font-medium">
              회의 일자
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="meetingDate"
                  variant={'outline'}
                  className={`w-full justify-start text-left font-norma focus-visible:ring-customG v ${
                    !meetingDate && 'text-gray-400'
                  }`}>
                  <CalendarDays className="w-4 h-4 mr-2 text-customG" />
                  {meetingDate ? format(meetingDate, 'yyyy년 MM월 dd일') : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={meetingDate || undefined}
                  onSelect={date => date && setField('meetingDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="meetingName" className="text-sm font-medium">
              회의 제목
            </Label>
            <div className="relative">
              <Input
                id="meetingName"
                placeholder="예: 2025년 1분기 ESG 위원회"
                value={meetingName}
                onChange={e => setField('meetingName', e.target.value)}
                className="border focus-visible:ring-customG"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="agenda" className="text-sm font-medium">
            회의 안건 및 의결 내용
          </Label>
          <Textarea
            id="agenda"
            placeholder="주요 논의사항, 의사결정 사항, 후속 조치 등을 상세히 기록해주세요."
            rows={5}
            value={agenda}
            onChange={e => setField('agenda', e.target.value)}
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
                  회의 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 회의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 관련
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
