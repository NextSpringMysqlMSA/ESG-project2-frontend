'use client'

import {useState} from 'react'
import CustomTable from './customTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
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
}

export default function CollapsibleWindow({
  type,
  headers,
  data,
  formContent,
  dialogTitle = '항목 입력'
}: CollapsibleWindowProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState<{
    row: string[]
    rowId: number
  } | null>(null)

  return (
    <div className="flex flex-col space-y-4">
      {/* 추가 버튼 */}
      <div className="flex flex-row justify-end w-full">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="w-24 p-2 text-white border bg-customG rounded-xl hover:bg-white hover:text-customG border-customG">
              + 항목 추가
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {formContent({
              onClose: () => setIsAddOpen(false),
              mode: 'add',
              row: [],
              rowId: -1
            })}
          </DialogContent>
        </Dialog>
      </div>

      {/* 수정 모달 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>항목 수정</DialogTitle>
          </DialogHeader>
          {selectedRowData &&
            formContent({
              onClose: () => {
                console.log('[CollapsibleWindow] Closing edit dialog')
                setSelectedRowData(null)
                setIsEditOpen(false)
              },
              row: selectedRowData.row,
              rowId: selectedRowData.rowId,
              mode: 'edit'
            })}
        </DialogContent>
      </Dialog>

      {/* 테이블 */}
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
    </div>
  )
}
