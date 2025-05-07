import {create} from 'zustand'
import type {meetingState as MeetingFields} from '@/types/IFRS/governance'

export type MeetingItem = MeetingFields

const DEFAULT_FIELDS: MeetingFields = {
  id: -1,
  meetingName: '',
  meetingDate: null,
  agenda: ''
}

interface MeetingStore extends MeetingFields {
  data: MeetingItem[]
  setField: (key: keyof MeetingFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: MeetingItem) => void
  clearList: () => void
  setData: (items: MeetingItem[]) => void
  persistToStorage: () => void
  initFromStorage: () => void
}

export const useMeetingStore = create<MeetingStore>(set => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) =>
    set(state => ({
      ...state,
      [key]: value
    })),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
    if (typeof window !== 'undefined') {
      localStorage.removeItem('meeting-storage')
    }
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('meeting-mode')
      if (mode !== 'add') return

      const state = useMeetingStore.getState()
      const dataToStore: MeetingFields = {
        id: -1,
        meetingName: state.meetingName,
        meetingDate: state.meetingDate,
        agenda: state.agenda
      }
      localStorage.setItem('meeting-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('meeting-mode')
      if (mode !== 'add') return

      const raw = localStorage.getItem('meeting-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({
          ...parsed,
          meetingDate: parsed.meetingDate ? new Date(parsed.meetingDate) : null // ✅ 날짜 변환 보정
        })
      } catch (e) {
        console.error('meeting-storage 복원 실패:', e)
      }
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
