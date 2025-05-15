'use client'

import {useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import CustomTable from './customTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '../ui/dialog'
import {PlusCircle, Edit, FileEdit} from 'lucide-react'
import {Button} from '@/components/ui/button'
import React from 'react'

type RowData = {
  id: number
  values: string[]
}

// 타입별 테마 설정 정의
export const typeThemeConfig = {
  committee: {
    color: 'blue',
    bgLight: 'bg-blue-50',
    bgHeader: 'bg-blue-100',
    textColor: 'text-blue-600',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-200',
    hover: 'hover:bg-blue-50/70'
  },
  meeting: {
    color: 'emerald',
    bgLight: 'bg-emerald-50',
    bgHeader: 'bg-emerald-100',
    textColor: 'text-emerald-600',
    buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
    border: 'border-emerald-200',
    hover: 'hover:bg-emerald-50/70'
  },
  KPI: {
    color: 'purple',
    bgLight: 'bg-purple-50',
    bgHeader: 'bg-purple-100',
    textColor: 'text-purple-600',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-50/70'
  },
  education: {
    color: 'amber',
    bgLight: 'bg-amber-50',
    bgHeader: 'bg-amber-100',
    textColor: 'text-amber-600',
    buttonBg: 'bg-amber-600 hover:bg-amber-700',
    border: 'border-amber-200',
    hover: 'hover:bg-amber-50/70'
  },
  risk: {
    color: 'rose',
    bgLight: 'bg-rose-50',
    bgHeader: 'bg-rose-100',
    textColor: 'text-rose-600',
    buttonBg: 'bg-rose-600 hover:bg-rose-700',
    border: 'border-rose-200',
    hover: 'hover:bg-rose-50/70'
  },
  scenario: {
    color: 'sky',
    bgLight: 'bg-sky-50',
    bgHeader: 'bg-sky-100',
    textColor: 'text-sky-600',
    buttonBg: 'bg-sky-600 hover:bg-sky-700',
    border: 'border-sky-200',
    hover: 'hover:bg-sky-50/70'
  },
  kpiGoal: {
    color: 'purple',
    bgLight: 'bg-purple-50',
    bgHeader: 'bg-purple-100',
    textColor: 'text-purple-600',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-50/70'
  },
  netZero: {
    color: 'green',
    bgLight: 'bg-green-50',
    bgHeader: 'bg-green-100',
    textColor: 'text-green-600',
    buttonBg: 'bg-green-600 hover:bg-green-700',
    border: 'border-green-200',
    hover: 'hover:bg-green-50/70'
  }
}

type CollapsibleWindowType = keyof typeof typeThemeConfig

type CollapsibleWindowProps = {
  type: CollapsibleWindowType
  headers: string[]
  data: RowData[]
  formContent: (props: {
    onClose: () => void
    row: string[]
    rowId: number
    mode: 'add' | 'edit'
  }) => React.ReactNode
  dialogTitle?: string
  description?: string
}

/**
 * CollapsibleWindow 컴포넌트
 *
 * 테이블 데이터와 항목 추가/수정 기능을 제공하는 접이식 윈도우 컴포넌트입니다.
 *
 * @param {CollapsibleWindowProps} props - 컴포넌트 속성
 * @returns {JSX.Element} 렌더링된 컴포넌트
 */
export default function CollapsibleWindow({
  type,
  headers,
  data,
  formContent,
  dialogTitle = '항목 입력',
  description
}: CollapsibleWindowProps) {
  // 상태 관리
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<{
    row: string[]
    rowId: number
  } | null>(null)

  // 테마 색상 설정 가져오기
  const theme = typeThemeConfig[type]

  // 아이콘 설정
  const icons = {
    add: <PlusCircle className={`w-4 h-4 mr-1 ${theme.textColor}`} />,
    edit: <Edit className={`w-5 h-5 mr-2 ${theme.textColor}`} />,
    empty: <FileEdit className={`w-8 h-8 text-gray-300`} />
  }

  // 항목 추가 핸들러
  const handleAdd = () => {
    setIsAddOpen(true)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedRowData(null)
    setIsEditOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4">
      <AnimatePresence>
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3}}
          className="w-full">
          {/* 추가 버튼 */}
          <div className="flex items-center justify-between mb-4">
            {data.length > 0 && (
              <p className="text-sm text-gray-500">
                총{' '}
                <span className={`font-medium ${theme.textColor}`}>{data.length}개</span>
                의 항목이 있습니다
              </p>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAdd}
                  className={`${theme.buttonBg} text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-1.5 px-3 py-1.5`}
                  size="sm">
                  <PlusCircle className="w-4 h-4" />
                  <span>항목 추가</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-xl sr-only" hidden>
                    <FileEdit className={`w-5 h-5 mr-2 ${theme.textColor}`} />
                    {dialogTitle}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="pt-1.5">
                      {description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                <div>
                  {formContent({
                    onClose: () => setIsAddOpen(false),
                    mode: 'add',
                    row: [],
                    rowId: -1
                  })}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 수정 모달 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl sr-only" hidden>
              {icons.edit}
              항목 수정
            </DialogTitle>
            {description && (
              <DialogDescription className="pt-1.5">
                항목 정보를 수정합니다
              </DialogDescription>
            )}
          </DialogHeader>
          <div>
            {selectedRowData &&
              formContent({
                onClose: () => {
                  console.log('[CollapsibleWindow] Closing edit dialog')
                  handleCloseModal()
                },
                row: selectedRowData.row,
                rowId: selectedRowData.rowId,
                mode: 'edit'
              })}
          </div>
        </DialogContent>
      </Dialog>

      {/* 테이블 섹션 */}
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.4, delay: 0.1}}
        className="w-full overflow-hidden bg-white border rounded-lg shadow-sm">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 p-6 text-center rounded-lg bg-gray-50">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
              {icons.empty}
            </div>
            <h3 className="mb-1 text-base font-medium text-gray-600">
              데이터가 없습니다
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              아직 등록된 항목이 없습니다. 새로운 항목을 추가해 보세요.
            </p>
            <Button
              onClick={handleAdd}
              className={`text-white ${theme.buttonBg}`}
              size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5 text-white" /> 첫 항목 추가하기
            </Button>
          </div>
        ) : (
          <CustomTable
            headers={headers}
            data={data}
            type={type}
            theme={theme}
            onRowClick={(_, row, rowId) => {
              console.log('[CollapsibleWindow] Row clicked:', row)
              console.log('[CollapsibleWindow] Row ID:', rowId)
              setSelectedRowData({row, rowId})
              setIsEditOpen(true)
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
