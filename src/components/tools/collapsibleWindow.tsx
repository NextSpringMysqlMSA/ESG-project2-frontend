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
  type: 'committee' | 'meeting' | 'KPI' | 'education'
  headers: string[]
  data: RowData[]
  formContent: (props: {
    onClose: () => void
    rowId?: number
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
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-end w-full">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center w-24 p-2 text-white transition-all duration-200 border bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG">
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
          {selectedRowId !== null &&
            formContent({
              onClose: () => {
                setSelectedRowId(null)
                setIsEditOpen(false)
              },
              rowId: selectedRowId,
              mode: 'edit'
            })}
        </DialogContent>
      </Dialog>

      <CustomTable
        headers={headers}
        data={data.map(d => d.values)}
        type={type}
        onRowClick={(type, row, rowIndex) => {
          const rowId = data[rowIndex].id
          setSelectedRowId(rowId)
          setIsEditOpen(true)
        }}
      />
    </div>
  )
}
