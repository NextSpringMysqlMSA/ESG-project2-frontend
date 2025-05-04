import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {kpiState as kpiFields} from '@/types/IFRS/governance'

interface kpiStore extends kpiFields {
  setField: (key: keyof kpiFields, value: string | number) => void
  resetFields: () => void
}

export const useKPIStore = create(
  persist<kpiStore>(
    set => ({
      executiveName: '',
      kpiName: '',
      targetValue: '',
      achievedValue: '',
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
