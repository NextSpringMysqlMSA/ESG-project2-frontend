import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {educationState as EducationFields} from '@/types/IFRS/governance'

interface educationStore extends EducationFields {
  data: EducationFields[]
  setField: (key: keyof EducationFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: EducationFields) => void
  clearList: () => void
  setData: (items: EducationFields[]) => void
}

export const useEducationStore = create(
  persist<educationStore>(
    set => ({
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
