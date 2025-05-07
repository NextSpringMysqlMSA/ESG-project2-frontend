import {create} from 'zustand'
import {kpiState as KPIFields} from '@/types/IFRS/governance'

export type KPIItem = KPIFields

const DEFAULT_FIELDS: KPIFields = {
  id: -1,
  executiveName: '',
  kpiName: '',
  targetValue: '',
  achievedValue: ''
}

interface KPIStore extends KPIFields {
  data: KPIItem[]
  setField: (key: keyof KPIFields, value: string | number) => void
  resetFields: () => void
  addItem: (item: KPIItem) => void
  clearList: () => void
  setData: (items: KPIItem[]) => void
  persistToStorage: () => void
  initFromStorage: () => void
}

export const useKPIStore = create<KPIStore>(set => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) =>
    set(state => ({
      ...state,
      [key]: value
    })),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('kpi-mode')
      if (mode !== 'add') return

      const state = useKPIStore.getState()
      const dataToStore: KPIFields = {
        id: -1,
        executiveName: state.executiveName,
        kpiName: state.kpiName,
        targetValue: state.targetValue,
        achievedValue: state.achievedValue
      }
      localStorage.setItem('kpi-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('kpi-mode')
      if (mode !== 'add') return

      const raw = localStorage.getItem('kpi-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({...parsed})
      } catch (e) {
        console.error('kpi-storage 복원 실패:', e)
      }
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),

  clearList: () => set({data: []}),

  setData: items => set({data: items})
}))
