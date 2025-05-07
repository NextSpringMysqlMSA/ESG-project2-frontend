import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {meetingState as MeetingFields} from '@/types/IFRS/governance'

// 단일 회의 항목 타입
export type MeetingItem = MeetingFields

interface MeetingStore extends MeetingFields {
  data: MeetingItem[]
  setField: (key: keyof MeetingFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: MeetingItem) => void
  clearList: () => void
  setData: (items: MeetingItem[]) => void
}

export const useMeetingStore = create<MeetingStore>()(
  persist<MeetingStore>(
    set => ({
      id: -1, // 신규 회의 항목일 경우 기본값
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
          id: -1,
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
