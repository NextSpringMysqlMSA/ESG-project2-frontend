import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {educationState as EducationFields} from '@/types/IFRS/governance'

interface educationStore extends EducationFields {
  setField: (key: keyof EducationFields, value: string | number | Date | null) => void
  resetFields: () => void
}

export const useEducationStore = create(
  persist<educationStore>(
    set => ({
      educationTitle: '',
      educationDate: null,
      participantCount: 0,
      content: '',
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
      }
    }),
    {
      name: 'education-storage'
    }
  )
)
