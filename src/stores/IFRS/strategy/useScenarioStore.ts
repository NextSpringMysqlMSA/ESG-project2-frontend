// src/stores/useScenarioStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {scenarioState as scenarioFields} from '@/types/IFRS/strategy'

export type scenarioItem = scenarioFields
interface scenarioStore extends scenarioFields {
  data: scenarioItem[]
  setField: (key: keyof scenarioFields, value: string | number) => void
  resetFields: () => void
  addItem: (item: scenarioItem) => void
  clearList: () => void
  setData: (items: scenarioItem[]) => void
}

export const useScenarioStore = create(
  persist<scenarioStore>(
    set => ({
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
      responseStrategy: '',
      data: [],

      setField: (key, value) =>
        set(state => ({
          ...state,
          [key]: value
        })),

      resetFields: () => {
        set({
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
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('scenario-storage')
        }
      },
      addItem: item => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: items => set({data: items})
    }),
    {
      name: 'scenario-storage' // localStorage key 이름
    }
  )
)
