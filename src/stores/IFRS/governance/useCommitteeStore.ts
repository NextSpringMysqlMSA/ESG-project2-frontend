import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {committeeState as CommitteeFields} from '@/types/IFRS/governance'

export type CommitteeItem = CommitteeFields & {id: number}

const DEFAULT_FIELDS: CommitteeFields = {
  committeeName: '',
  memberName: '',
  memberPosition: '',
  memberAffiliation: '',
  climateResponsibility: '',
  id: -1
}

interface CommitteeStore extends CommitteeFields {
  id: number
  data: CommitteeItem[]
  setField: (key: keyof CommitteeFields, value: string | number | null) => void
  resetFields: () => void
  persistToStorage: () => void
  initFromStorage: () => void
  addItem: (item: CommitteeItem) => void
  clearList: () => void
  setData: (items: CommitteeItem[]) => void
}

export const useCommitteeStore = create<CommitteeStore>((set, get) => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('committee-mode')
      if (mode !== 'add') return

      const state = get()
      const dataToStore: CommitteeFields = {
        committeeName: state.committeeName,
        memberName: state.memberName,
        memberPosition: state.memberPosition,
        memberAffiliation: state.memberAffiliation,
        climateResponsibility: state.climateResponsibility,
        id: -1
      }
      localStorage.setItem('committee-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      const mode = sessionStorage.getItem('committee-mode')
      if (mode !== 'add') return

      const raw = localStorage.getItem('committee-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({...parsed})
      } catch (e) {
        console.error('committee-storage 복원 실패:', e)
      }
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
