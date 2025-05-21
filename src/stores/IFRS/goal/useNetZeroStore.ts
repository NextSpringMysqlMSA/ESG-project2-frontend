import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {NetZeroAsset, NetZeroEmission, NetZeroResponse} from '@/types/IFRS/goal'
import {fetchNetZeroById} from '@/services/goal'

// 스토어 타입 정의
interface NetZeroStore {
  // 기본 필드들
  industrialSector: string
  baseYear: number
  targetYear: number
  assets: NetZeroAsset[]

  // 추가 필드들 (NetZeroResponse의 나머지 필드)
  id?: number
  memberId?: number
  emissions: NetZeroEmission[]
  scenario?: string | null
  createdAt?: string
  updatedAt?: string

  // 액션 메소드
  setField: <K extends keyof NetZeroStore>(key: K, value: NetZeroStore[K]) => void
  resetFields: () => void
  initFromApi: (id: number) => Promise<void>

  // 자산 관리
  addAsset: (asset: NetZeroAsset) => void
  updateAsset: (id: string, updates: Partial<NetZeroAsset>) => void
  removeAsset: (id: string) => void
  setAssets: (assets: NetZeroAsset[]) => void

  // 데이터 목록 관리
  data: NetZeroResponse[]
  addItem: (item: NetZeroResponse) => void
  clearList: () => void
  setData: (items: NetZeroResponse[]) => void
}

// 초기 상태 정의
const initialState = {
  // NetZeroPayload 필드
  industrialSector: '',
  baseYear: 0,
  targetYear: 0,
  assets: [] as NetZeroAsset[],

  // 추가 필드들
  emissions: [] as NetZeroEmission[],
  scenario: null as string | null,

  // 데이터 목록
  data: [] as NetZeroResponse[]
}

export const useNetZeroStore = create(
  persist<NetZeroStore>(
    set => ({
      ...initialState,

      // 필드 설정 메소드
      setField: (key, value) => set(state => ({...state, [key]: value})),

      // 필드 초기화
      resetFields: () =>
        set(state => ({
          ...state,
          ...initialState
        })),

      // API에서 데이터 초기화
      initFromApi: async (id: number) => {
        try {
          const response = await fetchNetZeroById(id)

          set({
            id: response.id
            // 다른 속성들...
          })

          // 값을 반환하지 않음
        } catch (error) {
          console.error('NetZero 데이터 로드 실패:', error)
          throw error
        }
      },

      // 자산 관리 메소드
      addAsset: (asset: NetZeroAsset) =>
        set(state => ({
          assets: [...state.assets, {...asset, id: asset.id || Date.now()}]
        })),

      updateAsset: (id: string, updates: Partial<NetZeroAsset>) =>
        set(state => ({
          assets: state.assets.map(asset =>
            asset.id?.toString() === id ? {...asset, ...updates} : asset
          )
        })),

      removeAsset: (id: string) =>
        set(state => ({
          assets: state.assets.filter(asset => asset.id?.toString() !== id)
        })),

      setAssets: (assets: NetZeroAsset[]) => set({assets}),

      // 데이터 목록 관리
      addItem: (item: NetZeroResponse) => set(state => ({data: [...state.data, item]})),

      clearList: () => set({data: []}),

      setData: (items: NetZeroResponse[]) => set({data: items})
    }),
    {
      name: 'netZero-storage'
    }
  )
)
