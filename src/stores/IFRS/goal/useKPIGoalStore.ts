import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {KPIGoalState as KPIGoalFields} from '@/types/IFRS/goal'

interface KPIGoalStore extends KPIGoalFields {
  setField: (key: keyof KPIGoalFields, value: string | number) => void
  resetFields: () => void
  data: KPIGoalFields[]
  addItem: (item: KPIGoalFields) => void
  clearList: () => void
  setData: (items: KPIGoalFields[]) => void
}

export const useKPIGoalStore = create(
  persist<KPIGoalStore>(
    set => ({
      indicator: '',
      detailedIndicator: '',
      unit: '',
      baseYear: 0,
      goalYear: 0,
      referenceValue: 0,
      currentValue: 0,
      targetValue: 0,
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
          indicator: '',
          detailedIndicator: '',
          unit: '',
          baseYear: 0,
          goalYear: 0,
          referenceValue: 0,
          currentValue: 0,
          targetValue: 0
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('KPIGoal-storage')
        }
      }
    }),
    {
      name: 'KPIGoal-storage'
    }
  )
)
