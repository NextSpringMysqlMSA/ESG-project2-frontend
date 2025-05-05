import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {meetingState as MeetingFields} from '@/types/IFRS/governance'

interface MeetingStore extends MeetingFields {
  data: MeetingFields[]
  setField: (key: keyof MeetingFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: MeetingFields) => void
  clearList: () => void
  setData: (items: MeetingFields[]) => void
}

export const useMeetingStore = create<MeetingStore>()(
  persist<MeetingStore>(
    set => ({
      meetingName: '',
      meetingDate: null,
      agenda: '',
      data: [],
      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),
      resetFields: () => {
        set({
          meetingName: '',
          meetingDate: null,
          agenda: ''
        })

        if (typeof window !== 'undefined') {
          localStorage.removeItem('meeting-storage')
        }
      },
      addItem: item => set(state => ({data: [...state.data, item]})),
      clearList: () => set({data: []}),
      setData: items => set({data: items})
    }),
    {
      name: 'meeting-storage'
    }
  )
)
