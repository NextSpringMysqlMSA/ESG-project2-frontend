// src/stores/useScenarioStore.ts
import {create} from 'zustand'
import type {scenarioState as ScenarioFields} from '@/types/IFRS/strategy'
import {fetchScenarioById} from '@/services/strategy'

export type ScenarioItem = ScenarioFields

interface ScenarioStore extends ScenarioFields {
  data: ScenarioItem[]
  setField: (key: keyof ScenarioFields, value: string | number) => void
  resetFields: () => void
  initFromStorage: () => void
  persistToStorage: () => void
  initFromApi: (id: number) => Promise<void>
  addItem: (item: ScenarioItem) => void
  clearList: () => void
  setData: (items: ScenarioItem[]) => void
}

const DEFAULT_FIELDS: ScenarioFields = {
  id: -1,
  regions: '',
  longitude: 0,
  latitude: 0,
  warming: '',
  industry: '',
  scenario: '',
  baseYear: 0,
  climate: '',
  damage: 0,
  format: '',
  responseStrategy: ''
}

export const useScenarioStore = create<ScenarioStore>(set => ({
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

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scenario-storage')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          set({...DEFAULT_FIELDS, ...parsed})
        } catch (e) {
          console.error('시나리오 로컬스토리지 파싱 오류:', e)
        }
      }
    }
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      set(state => {
        const dataToStore: ScenarioFields = {...state, id: -1}
        localStorage.setItem('scenario-storage', JSON.stringify(dataToStore))
        return {}
      })
    }
  },

  initFromApi: async (id: number) => {
    try {
      const data = await fetchScenarioById(id)
      set({...data})
    } catch (e) {
      console.error('API에서 scenario 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
