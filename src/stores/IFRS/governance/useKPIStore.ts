import {create} from 'zustand'
import {kpiState as KPIFields} from '@/types/IFRS/governance'
import {fetchKpiById} from '@/services/governance' // API 함수 import 추가

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
  initFromApi: (id: number) => Promise<void> // API 호출 함수 타입 추가
}

export const useKPIStore = create<KPIStore>((set, get) => ({
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
      const state = get()
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

  // API에서 KPI 데이터를 가져와 상태를 초기화하는 함수 추가
  initFromApi: async (id: number) => {
    try {
      const kpiData = await fetchKpiById(id)
      set({...kpiData})
    } catch (e) {
      console.error('API에서 KPI 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),

  clearList: () => set({data: []}),

  setData: items => set({data: items})
}))
