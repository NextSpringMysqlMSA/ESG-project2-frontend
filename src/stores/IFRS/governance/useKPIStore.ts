import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {kpiState as kpiFields} from '@/types/IFRS/governance'

interface kpiStore extends kpiFields {
  setField: (key: keyof kpiFields, value: string | number) => void
  resetFields: () => void
  data: kpiFields[]
  addItem: (item: kpiFields) => void
  clearList: () => void
  setData: (items: kpiFields[]) => void
}

export const useKPIStore = create(
  persist<kpiStore>(
    set => ({
      executiveName: '',
      kpiName: '',
      targetValue: '',
      achievedValue: '',
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
          executiveName: '',
          kpiName: '',
          targetValue: '',
          achievedValue: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kpi-storage')
        }
      }
    }),
    {
      name: 'kpi-storage'
    }
  )
)
