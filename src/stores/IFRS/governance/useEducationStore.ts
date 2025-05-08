import {create} from 'zustand'
import type {educationState as EducationFields} from '@/types/IFRS/governance'
import {fetchEducationById} from '@/services/governance' // API 함수 import 추가

export type EducationItem = EducationFields

const DEFAULT_FIELDS: EducationFields = {
  id: -1,
  educationTitle: '',
  educationDate: null,
  participantCount: 0,
  content: ''
}

interface EducationStore extends EducationFields {
  data: EducationItem[]
  setField: (key: keyof EducationFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: EducationItem) => void
  clearList: () => void
  setData: (items: EducationItem[]) => void
  persistToStorage: () => void
  initFromStorage: () => void
  initFromApi: (id: number) => Promise<void> // API 호출 함수 추가
}

export const useEducationStore = create<EducationStore>((set, get) => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) => set(state => ({...state, [key]: value})),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      // 세션 스토리지 체크 제거
      const state = get() // useEducationStore.getState() 대신 get() 사용
      const dataToStore: EducationFields = {
        id: -1,
        educationTitle: state.educationTitle,
        educationDate: state.educationDate,
        participantCount: state.participantCount,
        content: state.content
      }
      localStorage.setItem('education-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      // 세션 스토리지 체크 제거
      const raw = localStorage.getItem('education-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({
          ...parsed,
          educationDate: parsed.educationDate ? new Date(parsed.educationDate) : null // 날짜 변환 보정
        })
      } catch (e) {
        console.error('education-storage 복원 실패:', e)
      }
    }
  },

  // API에서 교육 데이터를 가져와 상태를 초기화하는 함수 추가
  initFromApi: async (id: number) => {
    try {
      const educationData = await fetchEducationById(id)
      // 날짜 문자열을 Date 객체로 변환
      set({
        ...educationData,
        educationDate: educationData.educationDate
          ? new Date(educationData.educationDate)
          : null
      })
    } catch (e) {
      console.error('API에서 education 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),

  clearList: () => set({data: []}),

  setData: items => set({data: items})
}))
