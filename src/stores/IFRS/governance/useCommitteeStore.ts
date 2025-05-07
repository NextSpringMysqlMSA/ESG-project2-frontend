import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {committeeState as CommitteeFields} from '@/types/IFRS/governance'

export type CommitteeItem = CommitteeFields & {id: number}

interface CommitteeStore extends CommitteeFields {
  id: number
  data: CommitteeItem[]
  setField: (key: keyof CommitteeFields, value: string | number | null) => void
  resetFields: () => void
  addItem: (item: CommitteeItem) => void
  clearList: () => void
  setData: (items: CommitteeItem[]) => void
}

export const useCommitteeStore = create(
  persist<CommitteeStore>(
    set => ({
      id: -1,
      committeeName: '',
      memberName: '',
      memberPosition: '',
      memberAffiliation: '',
      climateResponsibility: '',
      data: [],
      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () => {
        set({
          id: -1,
          committeeName: '',
          memberName: '',
          memberPosition: '',
          memberAffiliation: '',
          climateResponsibility: ''
        })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('education-storage')
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
