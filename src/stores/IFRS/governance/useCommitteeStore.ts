// store.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {committeeState as CommitteeFields} from '@/types/IFRS/governance'

// 단일 위원회 항목 타입
export type CommitteeItem = CommitteeFields

interface CommitteeStore extends CommitteeFields {
  data: CommitteeItem[]
  setField: (key: keyof CommitteeFields, value: string) => void
  resetFields: () => void
  addItem: (item: CommitteeItem) => void
  clearList: () => void
  setData: (items: CommitteeItem[]) => void // <- DB에서 불러온 데이터 저장용
}

export const useCommitteeStore = create(
  persist<CommitteeStore>(
    set => ({
      committeeName: '',
      memberName: '',
      memberPosition: '',
      memberAffiliation: '',
      climateResponsibility: '',
      data: [],
      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () => {
        set({
          committeeName: '',
          memberName: '',
          memberPosition: '',
          memberAffiliation: '',
          climateResponsibility: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('committee-storage')
        }
      },
      addItem: item => set(state => ({data: [...state.data, item]})),
      clearList: () => set({data: []}),
      setData: items => set({data: items})
    }),
    {
      name: 'committee-storage'
    }
  )
)
