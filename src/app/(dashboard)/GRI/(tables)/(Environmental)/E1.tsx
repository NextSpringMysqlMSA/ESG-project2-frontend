import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import E1Modal from './(modal)/E1Modal'

export default function E1() {
  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div className="flex justify-end w-full">
        <Dialog>
          <DialogTrigger>
            <button className="p-2 text-white border w-28 bg-customG rounded-xl hover:bg-white hover:text-customG border-customG">
              + 항목 추가
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>동환이 자서전</DialogTitle>
            </DialogHeader>
            <E1Modal />
          </DialogContent>
        </Dialog>
      </div>
      <table className="w-full text-center table-fixed">
        <thead className="border-b-2 border-b-black">
          <th>김</th>
          <th>동</th>
          <th>환</th>
          <th>김</th>
          <th>동</th>
          <th>환</th>
        </thead>
        <tbody>
          <tr>
            <td>김</td>
            <td>동</td>
            <td>환</td>
            <td>김</td>
            <td>동</td>
            <td>환</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
