import {create} from 'zustand'
import type {meetingState as MeetingFields} from '@/types/IFRS/governance'
import {fetchMeetingById} from '@/services/governance' // API 함수 import 추가

export type MeetingItem = MeetingFields

const DEFAULT_FIELDS: MeetingFields = {
  id: -1,
  meetingName: '',
  meetingDate: null,
  agenda: ''
}

interface MeetingStore extends MeetingFields {
  data: MeetingItem[]
  setField: (key: keyof MeetingFields, value: string | number | Date | null) => void
  resetFields: () => void
  addItem: (item: MeetingItem) => void
  clearList: () => void
  setData: (items: MeetingItem[]) => void
  persistToStorage: () => void
  initFromStorage: () => void
  initFromApi: (id: number) => Promise<void> // API 호출 함수 추가
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  ...DEFAULT_FIELDS,
  data: [],

  setField: (key, value) =>
    set(state => ({
      ...state,
      [key]: value
    })),

  resetFields: () => {
    set({...DEFAULT_FIELDS})
  },

  persistToStorage: () => {
    if (typeof window !== 'undefined') {
      // 세션 스토리지 체크 제거
      const state = get() // getState() 대신 get() 사용
      const dataToStore: MeetingFields = {
        id: -1,
        meetingName: state.meetingName,
        meetingDate: state.meetingDate,
        agenda: state.agenda
      }
      localStorage.setItem('meeting-storage', JSON.stringify(dataToStore))
    }
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      // 세션 스토리지 체크 제거
      const raw = localStorage.getItem('meeting-storage')
      if (!raw) return
      try {
        const parsed = JSON.parse(raw)
        set({
          ...parsed,
          meetingDate: parsed.meetingDate ? new Date(parsed.meetingDate) : null // 날짜 변환 보정
        })
      } catch (e) {
        console.error('meeting-storage 복원 실패:', e)
      }
    }
  },

  // API에서 미팅 데이터를 가져와 상태를 초기화하는 함수 추가
  initFromApi: async (id: number) => {
    try {
      const meetingData = await fetchMeetingById(id)
      // 날짜 문자열을 Date 객체로 변환
      set({
        ...meetingData,
        meetingDate: meetingData.meetingDate ? new Date(meetingData.meetingDate) : null
      })
    } catch (e) {
      console.error('API에서 meeting 데이터 초기화 실패:', e)
    }
  },

  addItem: item => set(state => ({data: [...state.data, item]})),
  clearList: () => set({data: []}),
  setData: items => set({data: items})
}))
