// src/stores/useRiskStore.ts
import {create} from 'zustand'
import type {riskState as RiskFields} from '@/types/IFRS/strategy'
import {fetchRiskById} from '@/services/strategy'

export type RiskItem = RiskFields

interface RiskStore extends RiskFields {
  data: RiskItem[]
  setField: (key: keyof RiskFields, value: string | number | null) => void
  resetFields: () => void
  initFromStorage: () => void
  persistToStorage: () => void
  initFromApi: (id: number) => Promise<void>
  addItem: (item: RiskItem) => void
  clearList: () => void
  setData: (items: RiskItem[]) => void
}

const DEFAULT_FIELDS: RiskFields = {
  id: -1,
  riskType: '',
  riskCategory: '',
  riskCause: '',
  time: '',
  impact: '',
  financialImpact: '',
  businessModelImpact: '',
  plans: ''
}

export const useRiskStore = create<RiskStore>(set => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('risk-storage')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          set({...parsed})
        } catch (e) {
          console.error('로컬스토리지 파싱 오류:', e)
        }
      }
    }
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      set(state => {
        const dataToStore: RiskFields = {
          id: -1,
          riskType: state.riskType,
          riskCategory: state.riskCategory,
          riskCause: state.riskCause,
          time: state.time,
          impact: state.impact,
          financialImpact: state.financialImpact,
          businessModelImpact: state.businessModelImpact,
          plans: state.plans
        }
        localStorage.setItem('risk-storage', JSON.stringify(dataToStore))
        return {}
      })
    }
  },

  initFromApi: async (id: number) => {
    try {
      const data = await fetchRiskById(id)
      set({...data})
    } catch (e) {
      console.error('API에서 risk 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
