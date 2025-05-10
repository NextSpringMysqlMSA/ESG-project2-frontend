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
import {cn} from '@/lib/utils'
import React from 'react'

type RowData = {
  id: number
  values: string[]
}

type CollapsibleWindowProps = {
  type:
    | 'committee'
    | 'meeting'
    | 'KPI'
    | 'education'
    | 'risk'
    | 'scenario'
    | 'kpiGoal'
    | 'netZero'
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

  // 타입별 색상 및 아이콘 설정
  const typeConfig = {
    committee: {color: 'blue', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    meeting: {color: 'emerald', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    KPI: {color: 'purple', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    education: {color: 'amber', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    risk: {color: 'rose', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    scenario: {color: 'sky', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    kpiGoal: {color: 'indigo', icon: <PlusCircle className="w-4 h-4 mr-1" />},
    netZero: {color: 'green', icon: <PlusCircle className="w-4 h-4 mr-1" />}
  }

  const currentConfig = typeConfig[type]

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
                총 <span className="font-medium text-customG">{data.length}개</span>의
                항목이 있습니다
              </p>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAdd}
                  className={cn(
                    'bg-customG hover:bg-customG/90 text-white shadow-sm',
                    `hover:shadow-md transition-all duration-200`
                  )}
                  size="sm">
                  {currentConfig.icon}
                  항목 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center text-xl">
                    <FileEdit className="w-5 h-5 mr-2 text-customG" />
                    {dialogTitle}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="pt-1.5">
                      {description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                <div className="mt-4">
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
            <DialogTitle className="flex items-center text-xl">
              <Edit className="w-5 h-5 mr-2 text-customG" />
              항목 수정
            </DialogTitle>
            {description && (
              <DialogDescription className="pt-1.5">
                항목 정보를 수정합니다
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
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
              <FileEdit className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="mb-1 text-base font-medium text-gray-600">
              데이터가 없습니다
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              아직 등록된 항목이 없습니다. 새로운 항목을 추가해 보세요.
            </p>
            <Button
              onClick={handleAdd}
              className="text-white bg-customG hover:bg-customG/90"
              size="sm">
              {currentConfig.icon} 첫 항목 추가하기
            </Button>
          </div>
        ) : (
          <CustomTable
            headers={headers}
            data={data}
            type={type}
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
