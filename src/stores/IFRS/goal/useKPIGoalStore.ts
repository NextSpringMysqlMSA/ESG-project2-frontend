import {create} from 'zustand'
import {KPIGoalFields, KPIGoalState} from '@/types/IFRS/goal'
import {fetchKpiGoalById} from '@/services/goal'

// 기본 필드 정의 - CommitteeStore 패턴과 일치
const DEFAULT_FIELDS: KPIGoalFields = {
  id: -1,
  indicator: '',
  detailedIndicator: '',
  unit: '',
  baseYear: 0,
  goalYear: 0,
  referenceValue: 0,
  currentValue: 0,
  targetValue: 0
}

// CommitteeStore 패턴과 동일하게 인터페이스 정의
interface KPIGoalStore extends KPIGoalFields {
  data: KPIGoalState[]
  setField: (key: keyof KPIGoalFields, value: string | number | undefined) => void
  resetFields: () => void
  persistToStorage: () => void
  initFromStorage: () => void
  initFromApi: (id: number) => Promise<void>
  addItem: (item: KPIGoalState) => void
  clearList: () => void
  setData: (items: KPIGoalState[]) => void
}

export const useKPIGoalStore = create<KPIGoalStore>((set, get) => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS}) // CommitteeStore 패턴과 동일
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const state = get()
      const dataToStore: KPIGoalFields = {
        id: -1,
        indicator: state.indicator,
        detailedIndicator: state.detailedIndicator,
        unit: state.unit,
        baseYear: state.baseYear,
        goalYear: state.goalYear,
        referenceValue: state.referenceValue,
        currentValue: state.currentValue,
        targetValue: state.targetValue
      }
      localStorage.setItem('kpigoal-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('kpigoal-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({...parsed}) // CommitteeStore 패턴과 동일
      } catch (e) {
        console.error('kpigoal-storage 복원 실패:', e)
      }
    }
  },

  initFromApi: async (id: number) => {
    try {
      const kpiGoalData = await fetchKpiGoalById(id)
      set({...kpiGoalData})
    } catch (e) {
      console.error('API에서 KPI 목표 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
