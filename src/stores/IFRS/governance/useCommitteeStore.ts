import {create} from 'zustand'
import type {committeeState as CommitteeFields} from '@/types/IFRS/governance'
import {fetchCommitteeById} from '@/services/governance'

export type CommitteeItem = CommitteeFields & {id: number}

const DEFAULT_FIELDS: CommitteeFields = {
  id: -1,
  committeeName: '',
  memberName: '',
  memberPosition: '',
  memberAffiliation: '',
  climateResponsibility: ''
}

interface CommitteeStore extends CommitteeFields {
  id: number
  data: CommitteeItem[]
  setField: (key: keyof CommitteeFields, value: string | number | null) => void
  resetFields: () => void
  persistToStorage: () => void
  initFromStorage: () => void
  initFromApi: (id: number) => Promise<void>
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
      // 세션 스토리지 체크 제거
      const state = get()
      const dataToStore: CommitteeFields = {
        id: -1,
        committeeName: state.committeeName,
        memberName: state.memberName,
        memberPosition: state.memberPosition,
        memberAffiliation: state.memberAffiliation,
        climateResponsibility: state.climateResponsibility
      }
      localStorage.setItem('committee-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      // 세션 스토리지 체크 제거
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

  // API에서 데이터를 가져와 상태를 초기화하는 함수
  initFromApi: async (id: number) => {
    try {
      const committeeData = await fetchCommitteeById(id)
      set({...committeeData})
    } catch (e) {
      console.error('API에서 committee 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
