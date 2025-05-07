import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {educationState as EducationFields} from '@/types/IFRS/governance'

// 단일 항목 타입에 id 포함
export type EducationItem = EducationFields

interface EducationStore extends EducationFields {
  data: EducationItem[]
  setField: (key: keyof EducationFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: EducationItem) => void
  clearList: () => void
  setData: (items: EducationItem[]) => void
}

export const useEducationStore = create(
  persist<EducationStore>(
    set => ({
      id: -1, // 기본값: 신규 항목임을 의미
      educationTitle: '',
      educationDate: null,
      participantCount: 0,
      content: '',
      data: [],

      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),

      resetFields: () => {
        set({
          id: -1,
          educationTitle: '',
          educationDate: null,
          participantCount: 0,
          content: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('education-storage')
        }
      },

      addItem: item => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: items => set({data: items})
    }),
    {
      name: 'education-storage'
    }
  )
)
