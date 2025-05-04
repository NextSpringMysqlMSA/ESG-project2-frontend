import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {meetingState as MeetingFields} from '@/types/IFRS/governance'

interface MeetingStore extends MeetingFields {
  setField: (key: keyof MeetingFields, value: string | number | Date | null) => void
  resetFields: () => void
}

export const useMeetingStore = create<MeetingStore>()(
  persist<MeetingStore>(
    set => ({
      meetingName: '',
      meetingDate: null,
      agenda: '',
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
      }
    }),
    {
      name: 'meeting-storage'
    }
  )
)
