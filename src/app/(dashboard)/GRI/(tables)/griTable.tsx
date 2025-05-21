'use client'

import {useState, useEffect, useCallback} from 'react'
import TextModal from './textModal'
import {cn} from '@/lib/utils'
import {Edit2, CheckCircle2, Save, RefreshCw, Trash2, AlertCircle} from 'lucide-react'
import {useToast} from '@/util/toast'
import {
  GriDisclosure,
  GriDisclosureRequest,
  fetchGriDisclosures,
  createGriDisclosure,
  updateGriDisclosure,
  deleteGriDisclosure
} from '@/services/gri'

// ==================== 타입 정의 ====================

// 테이블 셀 타입 정의
type TableCell = string | {value: string; rowSpan?: number}

// TableProps 타입 정의
type TableProps = {
  headers: string[]
  rows: TableCell[][]
  tableId: string
  categories?: Record<number, string> // 행 인덱스별 카테고리 매핑
}

// 삭제 확인 모달 Props
interface DeleteConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

// 액션 버튼 Props
interface ActionButtonProps {
  icon: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  className?: string
  isVisible?: boolean
}

// 셀 액션 Props
interface CellActionsProps {
  isSaving: boolean
  hasContent: boolean
  isSaved: boolean
  onDelete: (e: React.MouseEvent) => void
  onEditClick?: () => void
}

// ==================== 유틸리티 함수 ====================

// 셀 값 가져오기
const getCellValue = (cell: TableCell) => (typeof cell === 'string' ? cell : cell.value)

// ==================== 보조 컴포넌트 ====================

// 액션 버튼 컴포넌트
const ActionButton = ({
  icon,
  onClick,
  className,
  isVisible = true
}: ActionButtonProps) => {
  if (!isVisible) return null

  return (
    <div className={cn('p-1 transition-opacity', className)}>
      {onClick ? (
        <button onClick={onClick} className="p-1 rounded hover:bg-gray-50">
          {icon}
        </button>
      ) : (
        <>{icon}</>
      )}
    </div>
  )
}

// 셀 액션 컴포넌트
const CellActions = ({
  isSaving,
  hasContent,
  isSaved,
  onDelete,
  onEditClick
}: CellActionsProps) => {
  return (
    <div className="flex items-center mr-1 space-x-3">
      {/* 저장 중 아이콘 */}
      {isSaving && (
        <ActionButton icon={<Save className="w-5 h-5 text-customG animate-pulse" />} />
      )}

      {/* 저장 상태 및 삭제 버튼 */}
      {!isSaving && hasContent && (
        <>
          <ActionButton
            icon={
              <CheckCircle2
                className={cn('w-5 h-5', isSaved ? 'text-customG' : 'text-amber-500')}
              />
            }
          />

          {isSaved && (
            <ActionButton
              icon={<Trash2 className="w-5 h-5 text-red-500 hover:text-red-600" />}
              onClick={onDelete}
              className="opacity-0 group-hover:opacity-100"
            />
          )}
        </>
      )}

      {/* 편집 아이콘 */}
      <ActionButton
        icon={<Edit2 className="w-5 h-5 text-customG hover:text-customGDark" />}
        onClick={onEditClick}
        className="opacity-0 group-hover:opacity-100"
      />
    </div>
  )
}

// 삭제 확인 모달 컴포넌트
const DeleteConfirmModal = ({open, onClose, onConfirm, title}: DeleteConfirmProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl modal-center animate-modal-in">
        <div className="flex items-center mb-4 text-red-600">
          <AlertCircle className="w-6 h-6 mr-2" />
          <h3 className="text-lg font-medium">항목 삭제 확인</h3>
        </div>

        <p className="mb-6 text-gray-700">
          <span className="font-medium">{title}</span> 항목을 삭제하시겠습니까? 이 작업은
          되돌릴 수 없습니다.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

// ==================== 메인 컴포넌트 ====================

export default function GriTable({headers, rows, tableId, categories = {}}: TableProps) {
  // ===== 상태 관리 =====

  // 모달 관련 상태
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKey, setModalKey] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalContents, setModalContents] = useState<Record<string, string>>({})

  // UI 관련 상태
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // 삭제 모달 관련 상태
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    id: number
    griCode: string
    title: string
  } | null>(null)

  // API 관련 상태
  const [savedItems, setSavedItems] = useState<Record<string, GriDisclosure>>({})
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  const toast = useToast()

  // ===== 데이터 로드 함수 =====

  const fetchGriData = useCallback(async () => {
    // 이미 로딩 중이면 중복 요청 방지
    if (loading) return

    setLoading(true)
    setLoadError(null)

    try {
      const data = await fetchGriDisclosures()

      // 데이터가 없는 경우 처리
      if (data.length === 0) {
        setSavedItems({})
        setModalContents({})
        return
      }

      // 응답 데이터를 매핑하여 상태 업데이트
      const itemsMap: Record<string, GriDisclosure> = {}
      const contentsMap: Record<string, string> = {}

      data.forEach(item => {
        const key = `${tableId}:${item.griCode}`
        itemsMap[item.griCode] = item
        contentsMap[key] = item.content
      })

      setSavedItems(itemsMap)
      setModalContents(contentsMap)
    } catch (error: any) {
      // 404 에러는 데이터가 없는 정상 케이스로 처리
      if (error.response?.status === 404) {
        setLoadError('내용을 입력하여 새로운 항목을 생성할 수 있습니다.')
      } else {
        setLoadError(
          `데이터 로드 실패: ${error.response?.data?.message || error.message}`
        )
        toast.error('GRI 항목을 불러오는 중 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }, [loading, tableId, toast])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchGriData()

    // 1분마다 데이터 자동 갱신
    const intervalId = setInterval(() => {
      if (!loading) fetchGriData()
    }, 60000)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ===== 모달 관련 함수 =====

  // 모달 열기 함수
  const openModal = (key: string, title: string, content: string) => {
    setModalKey(key)
    setModalTitle(title)
    setModalContent(content)
    setModalOpen(true)
  }

  // 모달 닫기 및 데이터 저장 함수
  const closeModal = async (saveContent = true, content = modalContent) => {
    // 저장하지 않는 경우
    if (!modalKey || !saveContent) {
      setModalOpen(false)
      resetModalState()
      return
    }

    // 내용이 비어있는 경우
    if (!content || content.trim() === '') {
      toast.error('내용을 입력해주세요.')
      setModalOpen(false)
      resetModalState()
      return
    }

    // 키에서 griCode 추출
    const griCode = modalKey.split(':')[1]

    // 모달 닫기 (저장 전에 먼저 닫기)
    setModalOpen(false)

    // 저장 중 상태로 변경
    setSaving(prev => ({...prev, [modalKey]: true}))

    try {
      const existingItem = savedItems[griCode]

      if (existingItem) {
        // 기존 항목 업데이트
        await updateGriItem(existingItem, griCode, content)
      } else {
        // 새 항목 생성
        await createGriItem(griCode, content)
      }
    } catch (error: any) {
      handleApiError(error)
    } finally {
      // 저장 중 상태 해제
      setSaving(prev => ({...prev, [modalKey]: false}))
      resetModalState()
    }
  }

  // 모달 상태 초기화
  const resetModalState = () => {
    setModalKey('')
    setModalTitle('')
    setModalContent('')
  }

  // ===== 데이터 CRUD 함수 =====

  // 항목 업데이트 함수
  const updateGriItem = async (
    existingItem: GriDisclosure,
    griCode: string,
    content: string
  ) => {
    const result = await updateGriDisclosure(existingItem.id, {content})

    // UI 상태 업데이트
    setSavedItems(prev => ({
      ...prev,
      [griCode]: result
    }))

    setModalContents(prev => ({
      ...prev,
      [modalKey]: content
    }))

    toast.success(`${griCode} 항목이 업데이트되었습니다.`)
  }

  // 항목 생성 함수
  const createGriItem = async (griCode: string, content: string) => {
    // 행 인덱스 찾기
    const rowIndex = rows.findIndex(row => {
      const firstCell = row[0]
      const cellValue = getCellValue(firstCell)
      return cellValue === griCode
    })

    const category = categories[rowIndex] || '기타'
    const indicatorCell = rows[rowIndex][1]
    const indicator = getCellValue(indicatorCell)

    const requestData: GriDisclosureRequest = {
      griCode,
      indicator,
      category,
      content
    }

    const result = await createGriDisclosure(requestData)

    // UI 상태 업데이트
    setSavedItems(prev => ({
      ...prev,
      [griCode]: result
    }))

    setModalContents(prev => ({
      ...prev,
      [modalKey]: content
    }))

    toast.success(`${griCode} 항목이 생성되었습니다.`)
  }

  // 항목 삭제 함수
  const handleDelete = async (griCode: string, title: string) => {
    const item = savedItems[griCode]
    if (!item) return

    // 삭제 모달 열기
    setItemToDelete({
      id: item.id,
      griCode: griCode,
      title: `${griCode}: ${title}`
    })
    setDeleteModalOpen(true)
  }

  // 삭제 확인 시 실행
  const confirmDelete = async () => {
    if (!itemToDelete) return

    try {
      // 삭제 API 호출
      const success = await deleteGriDisclosure(itemToDelete.id)

      if (success) {
        // 상태 업데이트
        setSavedItems(prev => {
          const updated = {...prev}
          delete updated[itemToDelete.griCode]
          return updated
        })

        setModalContents(prev => {
          const updated = {...prev}
          delete updated[`${tableId}:${itemToDelete.griCode}`]
          return updated
        })

        toast.success(`${itemToDelete.griCode} 항목이 삭제되었습니다.`)
      } else {
        toast.error('항목 삭제 중 오류가 발생했습니다.')
      }
    } catch (error: any) {
      handleApiError(error, '삭제')
    } finally {
      setDeleteModalOpen(false)
      setItemToDelete(null)
    }
  }

  // API 에러 처리 함수
  const handleApiError = (error: any, action = '저장') => {
    toast.error(
      `항목을 ${action}하는 중 오류가 발생했습니다: ${
        error.response?.data?.message || error.message
      }`
    )
  }

  // ===== UI 관련 함수 =====

  // 행 스타일 계산
  const getRowStyle = (index: number) => {
    return cn(
      'transition-colors duration-200',
      index % 2 === 0 ? 'bg-white' : 'bg-customGLight/20',
      hoveredRow === index && 'bg-customGLight/40'
    )
  }

  // 셀 내용 존재 여부 확인
  const hasCellContent = (key: string): boolean => {
    return !!(modalContents[key] && modalContents[key].trim() !== '')
  }

  // ===== 렌더링 =====

  return (
    <div className="relative overflow-x-auto rounded-lg">
      {/* 텍스트 입력 모달 */}
      <TextModal
        open={modalOpen}
        title={modalTitle}
        value={modalContent}
        onChange={newText => {
          setModalContent(newText)
        }}
        onClose={() => closeModal(false)}
        onSave={textValue => {
          closeModal(true, textValue) // 여기서 modalContent 대신 직접 받은 textValue 사용
        }}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={itemToDelete?.title || ''}
      />

      {/* 테이블 */}
      <div className="overflow-hidden border-0 rounded-lg shadow-sm">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="text-sm font-medium text-customGTextDark bg-customGLight">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 text-left',
                    index !== headers.length - 1
                      ? 'border-r border-customGBorder/30'
                      : '',
                    index === 0 && 'rounded-tl-lg',
                    index === headers.length - 1 && 'rounded-tr-lg'
                  )}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-customGBorder/30">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={getRowStyle(i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}>
                {row.map((cell, j) => {
                  const content = typeof cell === 'string' ? {value: cell} : cell
                  const isLastCol = j === row.length - 1
                  const cellValue = content.value

                  // 모달 관련 데이터 추출
                  const noValue = row.length > 0 ? getCellValue(row[0]) : ''
                  const title = row.length > 1 ? getCellValue(row[1]) : '세부 내용'
                  const modalKey = `${tableId}:${noValue}`

                  // 상태 정보
                  const isSaved = !!savedItems[noValue]
                  const isSaving = saving[modalKey]
                  const isEmpty = isLastCol && !hasCellContent(modalKey)

                  // 표시할 내용 준비
                  const shortContent =
                    isLastCol && modalContents[modalKey]
                      ? modalContents[modalKey].length > 50
                        ? modalContents[modalKey].substring(0, 50) + '...'
                        : modalContents[modalKey]
                      : cellValue

                  return (
                    <td
                      key={j}
                      rowSpan={content.rowSpan}
                      className={cn(
                        'px-4 py-2.5 text-sm',
                        j !== row.length - 1 ? 'border-r border-customGBorder/20' : '',
                        isLastCol
                          ? 'w-full min-w-[300px] cursor-pointer group relative'
                          : j === 0
                          ? 'font-medium text-customGTextDark whitespace-nowrap'
                          : 'text-gray-700 whitespace-nowrap'
                      )}
                      onClick={() => {
                        if (isLastCol)
                          openModal(modalKey, title, modalContents[modalKey] || '')
                      }}>
                      {isLastCol ? (
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'transition-colors duration-200',
                              isEmpty ? 'text-gray-400 italic' : 'text-customGTextDark'
                            )}>
                            {isEmpty ? '내용을 입력하려면 클릭하세요' : shortContent}
                          </span>
                          <CellActions
                            isSaving={isSaving}
                            hasContent={hasCellContent(modalKey)}
                            isSaved={isSaved}
                            onDelete={e => {
                              e.stopPropagation()
                              handleDelete(noValue, title)
                            }}
                            onEditClick={() => {
                              openModal(modalKey, title, modalContents[modalKey] || '')
                            }}
                          />
                        </div>
                      ) : (
                        cellValue
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}

            {/* 데이터 없음 표시 */}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-8 text-center bg-customGLight/10 text-customGTextDark">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 mb-2 text-customG animate-spin" />
            <span className="text-sm text-customGTextDark">데이터 로드 중...</span>
          </div>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {loadError && !loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/95">
          <div className="flex flex-col items-center max-w-md p-6 text-center">
            <span className="mb-2 text-lg font-medium text-gray-600">{loadError}</span>
            <button
              onClick={() => fetchGriData()}
              className="px-4 py-2 mt-4 text-sm text-white transition-colors rounded-md bg-customG hover:bg-customGDark">
              다시 시도
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
