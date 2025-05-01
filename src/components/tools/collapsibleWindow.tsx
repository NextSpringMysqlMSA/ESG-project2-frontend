import CustomTable from './customTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'

type CollapsibleWindowProps = {
  headers: string[]
  formContent: React.ReactNode // Committee를 이걸로 대체
  dialogTitle?: string // Dialog 타이틀도 변경 가능하게
}

export default function CollapsibleWindow({
  headers,
  formContent,
  dialogTitle = '항목 입력'
}: CollapsibleWindowProps) {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row justify-end w-full ">
        <Dialog>
          <DialogTrigger className="flex items-center justify-center w-24 p-2 text-white transition-all duration-200 border bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG">
            + 항목 추가
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      </div>
      <CustomTable headers={headers} />
    </div>
  )
}
