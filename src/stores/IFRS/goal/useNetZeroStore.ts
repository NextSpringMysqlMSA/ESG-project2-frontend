import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {netZeroState as netZeroFields} from '@/types/IFRS/goal'

interface netZeroStore extends netZeroFields {
  setField: (key: keyof netZeroFields, value: string | number) => void
  resetFields: () => void
  data: netZeroFields[]
  addItem: (item: netZeroFields) => void
  clearList: () => void
  setData: (items: netZeroFields[]) => void
}

export const useNetZeroStore = create(
  persist<netZeroStore>(
    set => ({
      industrialGroup: '',
      scenario: '',
      baseYear: 0,
      midTargetYear: 0,
      finalTargetYear: 0,
      baseYearScope1: 0,
      baseYearScope2: 0,
      baseYearScope3: 0,
      data: [],
      addItem: item => set(state => ({data: [...state.data, item]})),
      clearList: () => set({data: []}),
      setData: items => set({data: items}),
      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),
      resetFields: () => {
        set({
          industrialGroup: '',
          scenario: '',
          baseYear: 0,
          midTargetYear: 0,
          finalTargetYear: 0,
          baseYearScope1: 0,
          baseYearScope2: 0,
          baseYearScope3: 0
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('KPIGoal-storage')
        }
      }
    }),
    {
      name: 'netZero-storage'
    }
  )
)
