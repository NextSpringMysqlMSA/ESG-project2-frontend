import {create} from 'zustand'
import {KPIGoalPayload, KPIGoalState} from '@/types/IFRS/goal'
import {fetchKpiGoalById} from '@/services/goal' // API 함수 import 추가

interface KPIGoalStore extends KPIGoalPayload {
  id: number // id 필드 추가
  setField: (key: keyof KPIGoalPayload, value: string | number) => void
  resetFields: () => void
  data: KPIGoalState[]
  addItem: (item: KPIGoalState) => void
  clearList: () => void
  setData: (items: KPIGoalState[]) => void
  persistToStorage: () => void // 로컬 스토리지에 저장 함수 추가
  initFromStorage: () => void // 로컬 스토리지에서 초기화 함수 추가
  initFromApi: (id: number) => Promise<void> // API에서 초기화 함수 추가
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

export const useKPIGoalStore = create<KPIGoalStore>((set, get) => ({
  ...initialState,
  id: -1, // id 초기값 추가

  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...initialState, id: -1})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const state = get()
      const dataToStore: KPIGoalPayload & {id: number} = {
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
        set({...parsed})
      } catch (e) {
        console.error('kpigoal-storage 복원 실패:', e)
      }
    }
  },

  // API에서 KPI 목표 데이터를 가져와 상태를 초기화하는 함수
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
