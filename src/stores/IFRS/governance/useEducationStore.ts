import {create} from 'zustand'
import type {educationState as EducationFields} from '@/types/IFRS/governance'

export type EducationItem = EducationFields

const DEFAULT_FIELDS: EducationFields = {
  id: -1,
  educationTitle: '',
  educationDate: null,
  participantCount: 0,
  content: ''
}

interface EducationStore extends EducationFields {
  data: EducationItem[]
  setField: (key: keyof EducationFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: EducationItem) => void
  clearList: () => void
  setData: (items: EducationItem[]) => void
  persistToStorage: () => void
  initFromStorage: () => void
}

export const useEducationStore = create<EducationStore>(set => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('education-mode')
      if (mode !== 'add') return

      const state = useEducationStore.getState()
      const dataToStore: EducationFields = {
        id: -1,
        educationTitle: state.educationTitle,
        educationDate: state.educationDate,
        participantCount: state.participantCount,
        content: state.content
      }
      localStorage.setItem('education-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('education-mode')
      if (mode !== 'add') return

      const raw = localStorage.getItem('education-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({...parsed})
      } catch (e) {
        console.error('education-storage 복원 실패:', e)
      }
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),

  clearList: () => set({data: []}),

  setData: items => set({data: items})
}))
