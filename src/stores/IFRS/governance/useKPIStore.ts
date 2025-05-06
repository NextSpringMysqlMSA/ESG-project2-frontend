import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {kpiState as KPIFields} from '@/types/IFRS/governance'

// 개별 KPI 항목 타입 정의
export type KPIItem = KPIFields

interface KPIStore extends KPIFields {
  data: KPIItem[]
  setField: (key: keyof KPIFields, value: string | number) => void
  resetFields: () => void
  addItem: (item: KPIItem) => void
  clearList: () => void
  setData: (items: KPIItem[]) => void
}

export const useKPIStore = create(
  persist<KPIStore>(
    set => ({
      id: -1, // 기본값: 신규 항목을 의미
      executiveName: '',
      kpiName: '',
      targetValue: '',
      achievedValue: '',
      data: [],

      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),

      resetFields: () => {
        set({
          id: -1,
          executiveName: '',
          kpiName: '',
          targetValue: '',
          achievedValue: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kpi-storage')
        }
      },

      addItem: item => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: items => set({data: items})
    }),
    {
      name: 'kpi-storage'
    }
  )
)
