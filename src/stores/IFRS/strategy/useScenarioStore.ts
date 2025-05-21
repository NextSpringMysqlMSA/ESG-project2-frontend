import {create} from 'zustand'
import {fetchScenarioById} from '@/services/strategy'

// 타입 정의 업데이트
export interface ScenarioFields {
  id: number
  regions: string
  longitude: number | null
  latitude: number | null
  assetType: string
  industry: string
  scenario: string
  baseYear: number
  climate: string
  assetValue: number
  estimatedDamage: number | null // 예상 피해액
}

export type ScenarioItem = ScenarioFields

const DEFAULT_FIELDS: ScenarioFields = {
  id: -1,
  regions: '',
  longitude: 0,
  latitude: 0,
  assetValue: 0,
  industry: '',
  scenario: '',
  baseYear: 0,
  climate: '',
  assetType: '',
  estimatedDamage: 0
}

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

export const useScenarioStore = create<ScenarioStore>((set, get) => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scenario-storage')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)

          // 필드명 변환 로직 (이전 백엔드 필드명 -> 새 필드명)
          const convertedData = {
            ...DEFAULT_FIELDS,
            ...parsed,
            assetType: parsed.damage || '', // 이전 필드명 매핑
            assetValue: parsed.warming || 0 // 이전 필드명 매핑
          }

          set(convertedData)
        } catch (e) {
          console.error('시나리오 로컬스토리지 파싱 오류:', e)
        }
      }
    }
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const state = get()
      const dataToStore: ScenarioFields = {
        id: -1,
        regions: state.regions,
        longitude: state.longitude,
        latitude: state.latitude,
        assetValue: state.assetValue,
        industry: state.industry,
        scenario: state.scenario,
        baseYear: state.baseYear,
        climate: state.climate,
        assetType: state.assetType,
        estimatedDamage: state.estimatedDamage // 추가된 필드 포함
      }
      localStorage.setItem('scenario-storage', JSON.stringify(dataToStore))
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
