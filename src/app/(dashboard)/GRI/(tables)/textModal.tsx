'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {Textarea} from '@/components/ui/textarea'
import DashButton from '@/components/tools/dashButton'

type TextModalProps = {
  open: boolean
  title: string
  value: string
  onChange: (value: string) => void
  onClose: () => void
}

export default function TextModal({
  open,
  title,
  value,
  onChange,
  onClose
}: TextModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Textarea
          className="min-h-[200px]"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <DialogFooter>
          <DashButton onClick={onClose} width="w-24">
            저장
          </DashButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
