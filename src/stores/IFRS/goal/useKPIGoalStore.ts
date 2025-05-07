import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {KPIGoalPayload, KPIGoalState} from '@/types/IFRS/goal'

interface KPIGoalStore extends KPIGoalPayload {
  setField: (key: keyof KPIGoalPayload, value: string | number) => void
  resetFields: () => void
  data: KPIGoalState[]
  addItem: (item: KPIGoalState) => void
  clearList: () => void
  setData: (items: KPIGoalState[]) => void
}

const initialState: KPIGoalPayload = {
  indicator: '',
  detailedIndicator: '',
  unit: '',
  baseYear: 0,
  goalYear: 0,
  referenceValue: 0,
  currentValue: 0,
  targetValue: 0
}

export const useKPIGoalStore = create(
  persist<KPIGoalStore>(
    set => ({
      ...initialState,

      data: [],

      setField: (key, value) => set(state => ({...state, [key]: value})),

      resetFields: () => set(initialState),

      addItem: item => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: items => set({data: items})
    }),
    {
      name: 'KPIGoal-storage'
    }
  )
)
