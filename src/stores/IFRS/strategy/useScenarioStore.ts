// src/stores/useScenarioStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {scenarioState as scenarioFields} from '@/types/IFRS/strategy'

interface scenarioStore extends scenarioFields {
  setField: (key: keyof scenarioFields, value: string | number) => void
  resetFields: () => void
}

const initialState: scenarioFields = {
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

export const useScenarioStore = create(
  persist<scenarioStore>(
    set => ({
      ...initialState,
      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () => set(() => ({...initialState}))
    }),
    {
      name: 'scenario-storage' // localStorage key 이름
    }
  )
)
