'use client'

import {useState, useEffect, useCallback} from 'react'
import {PlusCircle, Trash2, Save, Loader2, ChartBar} from 'lucide-react'
import CustomSelect from '@/components/tools/customSelect'
import {showError, showSuccess} from '@/util/toast'
import {motion} from 'framer-motion'
import {Button} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {createNetZero, fetchNetZeroById, updateNetZero} from '@/services/goal'
import {Label} from '@/components/ui/label'

type NetZeroProps = {
  onClose: () => void
  rowId?: number
  mode?: 'add' | 'edit'
}

// 자산 항목 타입 정의
interface AssetItem {
  id: string
  industry: string
  assetType: string
  amount: number | ''
  totalAssetValue: number | ''
  emissionFactor?: number | ''
  attributionFactor?: number | ''
  baseEmission?: number | ''
}

export default function NetZero({onClose, rowId, mode = 'add'}: NetZeroProps) {
  const isEditMode = mode === 'edit'

  // 산업군 및 자산 유형 옵션
  const industrialSectorOptions = ['금융업']
  const assetTypeOptions = ['상장 주식/채권', '기업 대출', 'PF', '부동산 담보대출']
  const industryOptions = [
    '전력 및 에너지',
    '화석연료 생산',
    '철강 제조',
    '시멘트 제조',
    '정유 및 화학',
    '운송',
    '전자',
    '농업/임업',
    '상업용 부동산',
    '주택담보대출'
  ]

  // 로컬 상태 정의
  const [industrialSector, setIndustrialSector] = useState<string>('금융업')
  const [baseYear, setBaseYear] = useState<number | ''>('')
  const [targetYear, setTargetYear] = useState<number | ''>('')
  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: Date.now().toString(),
      industry: '',
      assetType: '',
      amount: '',
      totalAssetValue: '',
      emissionFactor: '',
      attributionFactor: '',
      baseEmission: ''
    }
  ])
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(isEditMode)

  // 자산 유형 정규화 함수
  const normalizeAssetType = useCallback((type?: string): string => {
    if (!type) return ''

    // 대소문자 정규화 및 특수문자 처리
    const normalized = type.trim()

    // 자산 유형 표준화 매핑
    const typeMap: Record<string, string> = {
      상장주식: '상장 주식/채권',
      '상장주식/채권': '상장 주식/채권',
      주식: '상장 주식/채권',
      채권: '상장 주식/채권',
      기업대출: '기업 대출',
      대출: '기업 대출',
      pf: 'PF',
      project: 'PF',
      프로젝트: 'PF',
      부동산: '부동산 담보대출',
      부동산담보: '부동산 담보대출',
      부동산담보대출: '부동산 담보대출'
    }

    return typeMap[normalized] || type
  }, [])

  // 문자열 값을 number | "" 형식으로 변환하는 헬퍼 함수
  const toNumberOrEmpty = (value: string | number | undefined): number | '' => {
    if (value === undefined || value === '') return ''
    if (typeof value === 'string') {
      const parsed = parseFloat(value)
      return isNaN(parsed) ? '' : parsed
    }
    return value
  }

  const mapAssetData = useCallback(
    (asset: {
      id?: number | string
      industry?: string
      assetType?: string
      amount?: number | string
      totalAssetValue?: number | string
      emissionFactor?: number | string
      attributionFactor?: number | string
      baseEmission?: number | string
    }): AssetItem => {
      // 자산 유형 정규화
      const normalizedAssetType = normalizeAssetType(asset.assetType)

      return {
        id: String(asset.id || Date.now()),
        industry: asset.industry || '',
        assetType: normalizedAssetType,
        amount: toNumberOrEmpty(asset.amount),
        totalAssetValue: toNumberOrEmpty(asset.totalAssetValue),
        emissionFactor: toNumberOrEmpty(asset.emissionFactor),
        attributionFactor: toNumberOrEmpty(asset.attributionFactor),
        baseEmission: toNumberOrEmpty(asset.baseEmission)
      }
    },
    [normalizeAssetType]
  )

  // API 데이터 로드
  useEffect(() => {
    const loadNetZeroData = async () => {
      if (isEditMode && rowId) {
        try {
          setLoading(true)
          const data = await fetchNetZeroById(rowId)

          // API 응답 구조 확인 (개발용)
          console.log('API 응답 구조:', {
            industrialSector: data.industrialSector,
            baseYear: data.baseYear,
            targetYear: data.targetYear,
            hasIndustries: Array.isArray(data.industries) && data.industries.length > 0,
            industriesCount: data.industries?.length || 0
          })

          // 상태 업데이트
          setIndustrialSector(data.industrialSector || '금융업')
          setBaseYear(data.baseYear || '')
          setTargetYear(data.targetYear || '')

          // industries 배열 처리 (API 응답 구조에 맞게 수정)
          if (Array.isArray(data.industries) && data.industries.length > 0) {
            console.log('industries 배열에서 데이터 로드 (첫 항목):', data.industries[0])

            // 자산 유형 로깅 (디버깅용)
            data.industries.forEach((asset, idx) => {
              console.log(`자산 #${idx + 1} 유형(변환 전): ${asset.assetType}`)
            })

            const mappedAssets = data.industries.map(mapAssetData)

            // 변환 후 로깅 (디버깅용)
            mappedAssets.forEach((asset, idx) => {
              console.log(`자산 #${idx + 1} 유형(변환 후): ${asset.assetType}`)
            })

            setAssets(mappedAssets)
          } else if (Array.isArray(data.assets) && data.assets.length > 0) {
            // 백업: assets 배열이 있는 경우
            console.log('assets 배열에서 데이터 로드:', data.assets)
            setAssets(data.assets.map(mapAssetData))
          } else {
            console.warn('자산 데이터가 없습니다. 기본값 유지')
          }
        } catch (error) {
          console.error('NetZero 데이터 로드 실패:', error)
          showError('넷제로 목표 데이터를 불러오는데 실패했습니다.')
        } finally {
          setLoading(false)
        }
      }
    }

    loadNetZeroData()
  }, [isEditMode, rowId, mapAssetData])

  // 숫자 입력 처리 함수
  const handleNumberChange = useCallback(
    (value: string, setter: React.Dispatch<React.SetStateAction<number | ''>>) => {
      const parsed = parseInt(value, 10)
      setter(isNaN(parsed) ? '' : parsed)
    },
    []
  )

  // 자산 항목 추가
  const addAssetItem = useCallback(() => {
    setAssets(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        industry: '',
        assetType: '',
        amount: '',
        totalAssetValue: '',
        emissionFactor: '',
        attributionFactor: '',
        baseEmission: ''
      }
    ])
  }, [])

  // 자산 항목 삭제
  const removeAssetItem = useCallback((id: string) => {
    setAssets(prev => {
      if (prev.length <= 1) {
        showError('최소 하나의 자산 항목이 필요합니다')
        return prev
      }
      return prev.filter(asset => asset.id !== id)
    })
  }, [])

  // 자산 항목 업데이트
  const updateAssetItem = useCallback(
    (id: string, field: keyof AssetItem, value: any) => {
      setAssets(prev =>
        prev.map(asset => {
          if (asset.id === id) {
            // 자산 유형인 경우 정규화 적용
            if (field === 'assetType') {
              return {...asset, [field]: normalizeAssetType(value)}
            }
            return {...asset, [field]: value}
          }
          return asset
        })
      )
    },
    [normalizeAssetType]
  )

  // 숫자 입력 처리 (자산 항목)
  const handleAssetNumberChange = useCallback(
    (
      id: string,
      field: keyof Pick<
        AssetItem,
        | 'amount'
        | 'totalAssetValue'
        | 'emissionFactor'
        | 'attributionFactor'
        | 'baseEmission'
      >,
      value: string
    ) => {
      const parsed = parseFloat(value)
      updateAssetItem(id, field, isNaN(parsed) ? '' : parsed)
    },
    [updateAssetItem]
  )

  // 폼 유효성 검증
  const validateForm = useCallback(() => {
    if (!industrialSector || !baseYear || !targetYear) {
      showError('기본 정보를 모두 입력해주세요')
      return false
    }

    const validAssets = assets.every(
      asset =>
        asset.industry &&
        asset.assetType &&
        asset.amount !== '' &&
        asset.totalAssetValue !== ''
    )

    if (!validAssets) {
      showError(
        '모든 자산 항목의 필수 정보(산업, 자산 유형, 금액, 총 자산)를 완성해주세요'
      )
      return false
    }

    return true
  }, [assets, industrialSector, baseYear, targetYear])

  // 폼 제출 처리
  const handleSubmit = useCallback(async () => {
    if (submitting) return
    if (!validateForm()) return

    // 제출 전 데이터 검증 및 변환
    console.log('자산 항목 제출 전 데이터:', assets)

    try {
      setSubmitting(true)

      // 문자열 값이 있다면 숫자로 변환하여 페이로드 준비
      const payload = {
        industrialSector,
        baseYear: typeof baseYear === 'string' ? parseInt(baseYear) : baseYear,
        targetYear: typeof targetYear === 'string' ? parseInt(targetYear) : targetYear,
        industrialGroup: industrialSector, // 필수 필드 추가 (같은 값 사용)
        assets: assets.map(
          ({
            industry,
            assetType,
            amount,
            totalAssetValue,
            emissionFactor,
            attributionFactor,
            baseEmission
          }) => {
            // 필수 필드
            const formattedAsset: any = {
              industry,
              assetType,
              amount: typeof amount === 'string' ? parseFloat(amount) : amount,
              totalAssetValue:
                typeof totalAssetValue === 'string'
                  ? parseFloat(totalAssetValue)
                  : totalAssetValue
            }

            // 선택적 필드는 값이 있을 때만 포함
            if (emissionFactor !== undefined && emissionFactor !== '') {
              formattedAsset.emissionFactor =
                typeof emissionFactor === 'string'
                  ? parseFloat(emissionFactor)
                  : emissionFactor
            }

            if (attributionFactor !== undefined && attributionFactor !== '') {
              formattedAsset.attributionFactor =
                typeof attributionFactor === 'string'
                  ? parseFloat(attributionFactor)
                  : attributionFactor
            }

            if (baseEmission !== undefined && baseEmission !== '') {
              formattedAsset.baseEmission =
                typeof baseEmission === 'string' ? parseFloat(baseEmission) : baseEmission
            }

            return formattedAsset
          }
        )
      }

      console.log('최종 제출 데이터:', payload)

      if (isEditMode && rowId) {
        // 수정 모드
        await updateNetZero(rowId, payload)
        showSuccess('넷제로 목표가 성공적으로 수정되었습니다')
      } else {
        // 추가 모드
        await createNetZero(payload)
        showSuccess('넷제로 목표가 성공적으로 저장되었습니다')
      }
      onClose()
    } catch (err) {
      console.error('제출 오류:', err)
      showError(
        err instanceof Error ? err.message : '저장 실패: 서버 오류가 발생했습니다'
      )
    } finally {
      setSubmitting(false)
    }
  }, [
    assets,
    baseYear,
    industrialSector,
    isEditMode,
    onClose,
    rowId,
    submitting,
    targetYear,
    validateForm
  ])

  return (
    <motion.div
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col space-y-5 max-h-[80vh] overflow-auto custom-scrollbar w-full">
      {loading ? (
        <div className="flex items-center justify-center w-full h-64">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="ml-2 text-emerald-600">데이터를 불러오는 중...</span>
        </div>
      ) : (
        <>
          {/* 헤더 섹션 */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-emerald-50">
                <ChartBar className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3>{isEditMode ? '넷제로 목표 수정' : '넷제로 목표 설정'}</h3>
                <p className="text-sm text-gray-500">
                  금융 포트폴리오의 탄소배출 감축 목표를 설정하고 관리합니다
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* 기본 정보 섹션 */}
            <div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label className="block mb-2 text-sm font-medium text-slate-700">
                    산업군
                  </Label>
                  <CustomSelect
                    key="industrialSector"
                    placeholder="산업군 선택"
                    options={industrialSectorOptions}
                    value={industrialSector || ''}
                    onValueChange={setIndustrialSector}
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-slate-700">
                    기준 년도
                  </Label>
                  <input
                    type="text"
                    placeholder="예: 2020"
                    value={baseYear === '' ? '' : baseYear}
                    onChange={e => handleNumberChange(e.target.value, setBaseYear)}
                    className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>

                <div>
                  <Label className="block mb-2 text-sm font-medium text-slate-700">
                    목표 년도
                  </Label>
                  <input
                    type="text"
                    placeholder="예: 2050"
                    value={targetYear === '' ? '' : targetYear}
                    onChange={e => handleNumberChange(e.target.value, setTargetYear)}
                    className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 자산 항목 섹션 헤더 */}
            <div className="flex items-center justify-between pb-2 mt-4 border-b">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-black">투자/대출 포트폴리오</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addAssetItem}
                className="gap-1 bg-white text-customG border-customG hover:bg-customG hover:text-white">
                <PlusCircle className="w-4 h-4" /> 자산 추가
              </Button>
            </div>

            {/* 자산 항목 목록 */}
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <Card
                  key={asset.id}
                  className="overflow-hidden transition-shadow duration-200 border-l-4 shadow-sm border-l-emerald-500 hover:shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                          #{index + 1}
                        </Badge>
                        <h4 className="text-sm font-medium text-emerald-700">
                          자산 항목
                        </h4>
                        {asset.assetType && (
                          <div className="flex items-center">
                            <span className="ml-1 text-xs text-emerald-600">
                              ({asset.assetType})
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => removeAssetItem(asset.id)}
                        className="p-1 text-red-500 bg-white border border-red-500 hover:text-white hover:bg-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label className="mb-1 text-xs font-medium text-slate-700">
                          산업 분야
                        </Label>
                        <CustomSelect
                          key={`industry-${asset.id}`}
                          placeholder="산업 분야 선택"
                          options={industryOptions}
                          value={asset.industry || ''}
                          onValueChange={value =>
                            updateAssetItem(asset.id, 'industry', value)
                          }
                        />
                      </div>

                      <div>
                        <Label className="mb-1 text-xs font-medium text-slate-700">
                          자산 유형
                        </Label>
                        <CustomSelect
                          key={`assetType-${asset.id}`}
                          placeholder="자산 유형 선택"
                          options={assetTypeOptions}
                          value={asset.assetType || ''}
                          onValueChange={value =>
                            updateAssetItem(asset.id, 'assetType', value)
                          }
                        />
                      </div>

                      <div>
                        <Label className="mb-1 text-xs font-medium text-slate-700">
                          투자액/대출액 (원)
                        </Label>
                        <input
                          type="text"
                          value={asset.amount}
                          onChange={e =>
                            handleAssetNumberChange(asset.id, 'amount', e.target.value)
                          }
                          className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      </div>

                      <div>
                        <Label className="mb-1 text-xs font-medium text-slate-700">
                          총 자산/총 사업비/기업가치 (원)
                        </Label>
                        <input
                          type="text"
                          value={asset.totalAssetValue}
                          onChange={e =>
                            handleAssetNumberChange(
                              asset.id,
                              'totalAssetValue',
                              e.target.value
                            )
                          }
                          className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      </div>

                      {/* 추가 필드 (접은 형태로 표시) */}
                      <details className="col-span-2 p-2 mt-1 rounded-md">
                        <summary className="mb-2 text-xs font-medium cursor-pointer text-emerald-700">
                          추가 정보 (선택사항)
                        </summary>
                        <div className="grid grid-cols-1 gap-3 pt-2 md:grid-cols-3">
                          <div>
                            <Label className="mb-1 text-xs font-medium text-slate-700">
                              배출계수
                            </Label>
                            <input
                              type="text"
                              value={asset.emissionFactor}
                              onChange={e =>
                                handleAssetNumberChange(
                                  asset.id,
                                  'emissionFactor',
                                  e.target.value
                                )
                              }
                              className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>

                          <div>
                            <Label className="mb-1 text-xs font-medium text-slate-700">
                              기여도 계수
                            </Label>
                            <input
                              type="text"
                              value={asset.attributionFactor}
                              onChange={e =>
                                handleAssetNumberChange(
                                  asset.id,
                                  'attributionFactor',
                                  e.target.value
                                )
                              }
                              className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>

                          <div>
                            <Label className="mb-1 text-xs font-medium text-slate-700">
                              기준 배출량
                            </Label>
                            <input
                              type="text"
                              value={asset.baseEmission}
                              onChange={e =>
                                handleAssetNumberChange(
                                  asset.id,
                                  'baseEmission',
                                  e.target.value
                                )
                              }
                              className="flex w-full px-3 py-1 text-base transition-colors bg-transparent border rounded-md shadow-sm h-9 border-input file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-customG disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            />
                          </div>
                        </div>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 저장 버튼 */}
            <div className="flex flex-row items-center justify-end w-full space-x-3 ">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                className="gap-1">
                취소
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-1 text-white bg-customG hover:bg-customGDark">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditMode ? '수정하기' : '저장하기'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
