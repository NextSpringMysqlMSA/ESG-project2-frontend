import {create} from 'zustand'
import {KPIGoalPayload, KPIGoalState} from '@/types/IFRS/goal'
import {fetchKpiGoalById} from '@/services/goal'
import {persist, createJSONStorage} from 'zustand/middleware'

interface KPIGoalStore extends KPIGoalPayload {
  id: number
  setField: (key: keyof KPIGoalPayload, value: string | number | undefined) => void
  setBulkFields: (fields: Partial<KPIGoalPayload>) => void // 여러 필드 한번에 설정
  resetFields: () => void
  data: KPIGoalState[]
  setData: (items: KPIGoalState[]) => void
  initFromApi: (id: number) => Promise<void>
  persistToStorage: () => void
  initFromStorage: () => void
  isLoading: boolean // 로딩 상태 추가
  setLoading: (loading: boolean) => void
  hasError: boolean // 오류 상태 추가
  setError: (hasError: boolean) => void
}

// 초기 상태 정의 - undefined로 설정하여 0 값과 빈 값 구분
const initialState: Omit<
  KPIGoalStore,
  | 'setField'
  | 'setBulkFields'
  | 'resetFields'
  | 'data'
  | 'setData'
  | 'initFromApi'
  | 'persistToStorage'
  | 'initFromStorage'
  | 'isLoading'
  | 'setLoading'
  | 'hasError'
  | 'setError'
> = {
  id: -1,
  indicator: '',
  detailedIndicator: '',
  unit: '',
  baseYear: undefined, // 0 대신 undefined로 변경
  goalYear: undefined, // 0 대신 undefined로 변경
  referenceValue: undefined, // 0 대신 undefined로 변경
  currentValue: undefined, // 0 대신 undefined로 변경
  targetValue: undefined // 0 대신 undefined로 변경
}

// 스토어 생성 - persist 미들웨어 사용
export const useKPIGoalStore = create<KPIGoalStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      data: [],
      isLoading: false,
      hasError: false,

      // 로딩 상태 설정
      setLoading: (loading: boolean) => set({isLoading: loading}),

      // 오류 상태 설정
      setError: (hasError: boolean) => set({hasError}),

      // 필드 설정 - undefined 값도 처리
      setField: (key, value) => {
        set(state => ({...state, [key]: value}))

        // 자동 저장 처리 (편집 모드가 아닌 경우에만)
        if (get().id === -1) {
          setTimeout(() => get().persistToStorage(), 100)
        }
      },

      // 여러 필드 한번에 설정 (대량 업데이트 최적화)
      setBulkFields: fields => {
        set(state => ({...state, ...fields}))

        // 자동 저장 처리 (편집 모드가 아닌 경우에만)
        if (get().id === -1) {
          setTimeout(() => get().persistToStorage(), 100)
        }
      },

      // 모든 필드 초기화 - 데이터 목록 유지
      resetFields: () => {
        set(state => ({
          ...initialState,
          data: state.data,
          isLoading: false,
          hasError: false
        }))

        // 로컬 스토리지에서도 삭제
        if (typeof window !== 'undefined') {
          localStorage.removeItem('kpigoal-storage')
        }
      },

      // 데이터 목록 설정
      setData: items => set({data: items}),

      // API에서 데이터 로드
      // initFromApi 함수 수정
      initFromApi: async id => {
        try {
          set({isLoading: true, hasError: false})

          const response = await fetchKpiGoalById(id)

          console.log('API 응답 데이터:', response) // 디버깅용 로그

          // API 응답이 없는 경우 처리
          if (!response) {
            console.error('API에서 KPI 목표 데이터를 찾을 수 없습니다:', id)
            set({hasError: true, isLoading: false})
            return
          }

          // null, undefined, 0 처리를 위한 안전한 변환 함수
          const safeValue = <T>(value: T | null | undefined): T | undefined => {
            if (value === null || value === undefined) return undefined
            if (typeof value === 'number' && value === 0) return undefined
            return value
          }

          // 데이터 포맷 변환
          const formattedData = {
            id: response.id,
            indicator: response.indicator || '',
            detailedIndicator: response.detailedIndicator || '',
            unit: response.unit || '',
            baseYear: safeValue(response.baseYear),
            goalYear: safeValue(response.goalYear),
            referenceValue: safeValue(response.referenceValue),
            currentValue: safeValue(response.currentValue),
            targetValue: safeValue(response.targetValue)
          }

          console.log('변환된 데이터:', formattedData) // 디버깅용 로그

          set({...formattedData, isLoading: false})
        } catch (error) {
          console.error('API에서 KPI 목표 데이터 로드 실패:', error)
          set({hasError: true, isLoading: false})
          throw error
        }
      },

      // 로컬 스토리지에 저장
      persistToStorage: () => {
        if (typeof window !== 'undefined') {
          const state = get()
          const dataToStore = {
            indicator: state.indicator,
            detailedIndicator: state.detailedIndicator,
            unit: state.unit,
            baseYear: state.baseYear,
            goalYear: state.goalYear,
            referenceValue: state.referenceValue,
            currentValue: state.currentValue,
            targetValue: state.targetValue
          }
          localStorage.setItem('kpigoal-storage', JSON.stringify(dataToStore))
        }
      },

      // 로컬 스토리지에서 로드
      initFromStorage: () => {
        if (typeof window !== 'undefined') {
          set({isLoading: true, hasError: false})

          try {
            const raw = localStorage.getItem('kpigoal-storage')
            if (!raw) {
              set({isLoading: false})
              return
            }

            const parsed = JSON.parse(raw)

            // 안전한 변환 함수 사용
            const safeValue = <T>(value: T | null | undefined): T | undefined => {
              if (value === null || value === undefined) return undefined
              if (typeof value === 'number' && value === 0) return undefined
              return value
            }

            // 값 검증 및 포맷팅 (0을 undefined로 변환)
            const formattedData = {
              id: -1, // 새 항목은 항상 -1
              indicator: parsed.indicator || '',
              detailedIndicator: parsed.detailedIndicator || '',
              unit: parsed.unit || '',
              baseYear: safeValue(parsed.baseYear),
              goalYear: safeValue(parsed.goalYear),
              referenceValue: safeValue(parsed.referenceValue),
              currentValue: safeValue(parsed.currentValue),
              targetValue: safeValue(parsed.targetValue)
            }

            set({...formattedData, isLoading: false})
          } catch (error) {
            console.error('로컬 스토리지에서 KPI 목표 데이터 로드 실패:', error)
            // 오류 발생 시 초기화
            localStorage.removeItem('kpigoal-storage')
            set({hasError: true, isLoading: false})
          }
        }
      }
    }),
    {
      name: 'kpigoal-store', // persist 미들웨어용 스토어 이름
      storage: createJSONStorage(() => localStorage), // 로컬 스토리지 사용
      partialize: state => ({
        // 저장할 상태 부분 선택
        indicator: state.indicator,
        detailedIndicator: state.detailedIndicator,
        unit: state.unit,
        baseYear: state.baseYear,
        goalYear: state.goalYear,
        referenceValue: state.referenceValue,
        currentValue: state.currentValue,
        targetValue: state.targetValue
      })
    }
  )
)
