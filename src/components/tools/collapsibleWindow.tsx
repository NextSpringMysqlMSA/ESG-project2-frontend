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

type CollapsibleWindowProps = {
  type: 'committee' | 'meeting' | 'KPI' | 'education'
  headers: string[]
  data: string[][]
  formContent: (props: {
    onClose: () => void
    row?: string[]
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
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null)

  const openEditDialog = (row: string[]) => {
    setSelectedRow(row)
    setIsEditOpen(true)
  }

  const closeEditDialog = () => {
    setSelectedRow(null)
    setIsEditOpen(false)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-end w-full">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-center w-24 p-2 text-white transition-all duration-200 border bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG">
              + 항목 추가
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {formContent({onClose: () => setIsAddOpen(false), mode: 'add'})}
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>항목 수정</DialogTitle>
          </DialogHeader>
          {selectedRow &&
            formContent({onClose: closeEditDialog, row: selectedRow, mode: 'edit'})}
        </DialogContent>
      </Dialog>

      <CustomTable
        headers={headers}
        data={data}
        type={type}
        onRowClick={(_, row) => openEditDialog(row)}
      />
    </div>
  )
}
