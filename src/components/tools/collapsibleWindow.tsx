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
  headers: string[]
  formContent: (props: {onClose: () => void}) => React.ReactNode
  dialogTitle?: string
}

export default function CollapsibleWindow({
  headers,
  formContent,
  dialogTitle = '항목 입력'
}: CollapsibleWindowProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-end w-full">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            {formContent({onClose: handleClose})}
          </DialogContent>
        </Dialog>
      </div>
      <CustomTable headers={headers} />
    </div>
  )
}
