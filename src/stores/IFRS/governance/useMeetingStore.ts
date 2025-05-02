import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {meetingState as meetingFields} from '@/types/IFRS/governance'

interface meetingStore extends meetingFields {
  setField: (key: keyof meetingFields, value: string | number | Date) => void
  resetFields: () => void
}

export const useMeetingStore = create(
  persist<meetingStore>(
    set => ({
      meetingName: '',
      meetingDate: new Date(),
      agenda: '',
      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),
      resetFields: () =>
        set({
          meetingName: '',
          meetingDate: new Date(),
          agenda: ''
        })
    }),
    {
      name: 'meeting-storage'
    }
  )
)
