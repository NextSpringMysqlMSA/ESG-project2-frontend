// src/stores/useCommitteeStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {riskState as riskFields} from '@/types/IFRS/strategy'

interface RiskStore extends riskFields {
  setField: (key: keyof riskFields, value: string) => void
  resetFields: () => void
}

export const useRiskStore = create(
  persist<RiskStore>(
    set => ({
      riskType: '',
      riskCategory: '',
      riskCause: '',
      time: '',
      impact: '',
      financialImpact: '',
      businessModelImpact: '',
      plans: '',
      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () =>
        set({
          riskType: '',
          riskCategory: '',
          riskCause: '',
          time: '',
          impact: '',
          financialImpact: '',
          businessModelImpact: '',
          plans: ''
        })
    }),
    {
      name: 'risk-storage'
    }
  )
)
