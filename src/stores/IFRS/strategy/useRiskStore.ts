// src/stores/useRiskStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {riskState as RiskFields} from '@/types/IFRS/strategy'

export type RiskItem = RiskFields
interface RiskStore extends RiskFields {
  data: RiskItem[]
  setField: (key: keyof RiskFields, value: string | number | null) => void
  resetFields: () => void
  addItem: (item: RiskItem) => void
  clearList: () => void
  setData: (items: RiskItem[]) => void
}

export const useRiskStore = create(
  persist<RiskStore>(
    set => ({
      id: -1,
      riskType: '',
      riskCategory: '',
      riskCause: '',
      time: '',
      impact: '',
      financialImpact: '',
      businessModelImpact: '',
      plans: '',
      data: [],
      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),
      resetFields: () => {
        set({
          id: -1,
          riskType: '',
          riskCategory: '',
          riskCause: '',
          time: '',
          impact: '',
          financialImpact: '',
          businessModelImpact: '',
          plans: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('risk-storage')
        }
      },
      addItem: item => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: items => set({data: items})
    }),
    {
      name: 'risk-storage'
    }
  )
)
