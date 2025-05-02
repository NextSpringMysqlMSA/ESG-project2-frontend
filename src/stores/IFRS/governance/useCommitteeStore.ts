// src/stores/useCommitteeStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import type {CommitteeState as CommitteeFields} from '../../../types/IFRS/governance/commitee'

interface CommitteeStore extends CommitteeFields {
  setField: (key: keyof CommitteeFields, value: string) => void
  resetFields: () => void
}

export const useCommitteeStore = create(
  persist<CommitteeStore>(
    set => ({
      committeeName: '',
      memberName: '',
      memberPosition: '',
      memberAffiliation: '',
      climateResponsibility: '',
      setField: (key, value) => set(state => ({...state, [key]: value})),
      resetFields: () =>
        set({
          committeeName: '',
          memberName: '',
          memberPosition: '',
          memberAffiliation: '',
          climateResponsibility: ''
        })
    }),
    {
      name: 'committee-storage'
    }
  )
)
