import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {NetZeroPayload, NetZeroState} from '@/types/IFRS/goal'

interface NetZeroStore extends NetZeroPayload {
  setField: (key: keyof NetZeroPayload, value: string | number) => void
  resetFields: () => void
  data: NetZeroState[]
  addItem: (item: NetZeroState) => void
  clearList: () => void
  setData: (items: NetZeroState[]) => void
}

const initialState: NetZeroPayload = {
  industrialGroup: '',
  scenario: '',
  baseYear: 0,
  midTargetYear: 0,
  finalTargetYear: 0,
  baseYearScope1: 0,
  baseYearScope2: 0,
  baseYearScope3: 0
}

export const useNetZeroStore = create(
  persist<NetZeroStore>(
    set => ({
      ...initialState,

      data: [],

      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () => set(initialState),
      addItem: item => set(state => ({data: [...state.data, item]})),
      clearList: () => set({data: []}),
      setData: items => set({data: items})
    }),
    {
      name: 'netZero-storage'
    }
  )
)
