import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface UIState {
  // UI 관련 상태를 여기에 추가
  showInfoCards: boolean
  toggleInfoCards: () => void
  setShowInfoCards: (show: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      showInfoCards: true, // 기본값은 표시 상태

      toggleInfoCards: () => set(state => ({showInfoCards: !state.showInfoCards})),

      setShowInfoCards: (show: boolean) => set({showInfoCards: show})
    }),
    {
      name: 'ui-state', // 로컬 스토리지에 저장될 키 이름
      partialize: state => ({showInfoCards: state.showInfoCards})
    }
  )
)
