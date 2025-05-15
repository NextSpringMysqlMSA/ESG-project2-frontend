'use client'

import {useState} from 'react'
import {
  PlusCircle,
  Trash2,
  Save,
  Building2,
  ArrowRight,
  Calendar,
  Landmark,
  Loader2
} from 'lucide-react'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {showError, showSuccess} from '@/util/toast'
import {motion, AnimatePresence} from 'framer-motion'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'
import {createNetZero} from '@/services/goal'
import {IFRSGoalFormCard} from '@/components/forms/module-forms'
import {IFRSGoalButton} from '@/components/buttons/module-buttons'
import DashButton from '@/components/tools/dashButton'

type NetZeroProps = {
  onClose: () => void
}

// 자산 항목 타입 정의
interface AssetItem {
  id: string
  industry: string
  assetType: string
  amount: number | ''
  totalAssetValue: number | ''
}

// 기존 스토어 대신 로컬 상태 사용
export default function NetZero({onClose}: NetZeroProps) {
  // 산업군 및 자산 유형 옵션
  const industrialSectorOptions = ['금융업']
  const assetTypeOptions = ['상장 주식/채권', '기업 대출', 'PF', '부동산 담보대출']
  const industryOptions = [
    '철강 제조',
    '정유 및 화학',
    '화석연료 생산',
    'IT/통신',
    '자동차',
    '반도체',
    '유틸리티',
    '건설/인프라'
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
      totalAssetValue: ''
    }
  ])
  const [submitting, setSubmitting] = useState(false)

  // 숫자 입력 처리 함수
  const handleNumberChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number | ''>>
  ) => {
    const parsed = parseInt(value, 10)
    setter(isNaN(parsed) ? '' : parsed)
  }

  // 자산 항목 추가
  const addAssetItem = () => {
    setAssets([
      ...assets,
      {
        id: Date.now().toString(),
        industry: '',
        assetType: '',
        amount: '',
        totalAssetValue: ''
      }
    ])
  }

  // 자산 항목 삭제
  const removeAssetItem = (id: string) => {
    if (assets.length <= 1) {
      showError('최소 하나의 자산 항목이 필요합니다')
      return
    }
    setAssets(assets.filter(asset => asset.id !== id))
  }

  // 자산 항목 업데이트
  const updateAssetItem = (id: string, field: keyof AssetItem, value: any) => {
    setAssets(
      assets.map(asset => {
        if (asset.id === id) {
          return {...asset, [field]: value}
        }
        return asset
      })
    )
  }

  // 숫자 입력 처리 (자산 항목)
  const handleAssetNumberChange = (
    id: string,
    field: 'amount' | 'totalAssetValue',
    value: string
  ) => {
    const parsed = parseInt(value, 10)
    updateAssetItem(id, field, isNaN(parsed) ? '' : parsed)
  }

  // 폼 유효성 검증
  const validateForm = () => {
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
      showError('모든 자산 항목을 완성해주세요')
      return false
    }

    return true
  }

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (submitting) return
    if (!validateForm()) return

    // 문자열 값이 있다면 숫자로 변환
    const payload = {
      industrialSector,
      baseYear: typeof baseYear === 'string' ? parseInt(baseYear) : baseYear,
      targetYear: typeof targetYear === 'string' ? parseInt(targetYear) : targetYear,
      assets: assets.map(({industry, assetType, amount, totalAssetValue}) => ({
        industry,
        assetType,
        amount: typeof amount === 'string' ? parseFloat(amount) : amount,
        totalAssetValue:
          typeof totalAssetValue === 'string'
            ? parseFloat(totalAssetValue)
            : totalAssetValue
      }))
    }

    try {
      setSubmitting(true)
      await createNetZero(payload)
      showSuccess('넷제로 목표가 성공적으로 저장되었습니다')
      onClose()
    } catch (err) {
      showError(
        err instanceof Error ? err.message : '저장 실패: 서버 오류가 발생했습니다'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // 자산 유형에 따른 아이콘 선택 함수도 수정
  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case '상장 주식/채권':
        return <Landmark className="w-4 h-4 text-customG" />
      case '기업 대출':
        return <Building2 className="w-4 h-4 text-customG" />
      case 'PF':
        return <ArrowRight className="w-4 h-4 text-customG" />
      case '부동산 담보대출':
        return <Building2 className="w-4 h-4 text-customG" />
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      className="flex flex-col w-full h-full">
      <IFRSGoalFormCard
        title="넷제로 목표 설정"
        icon={<Building2 className="w-5 h-5" />}
        description="금융 포트폴리오의 탄소배출 감축 목표를 설정하고 관리합니다"
        actions={
          <div className="flex items-center justify-end space-x-3">
            <IFRSGoalButton
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              size="sm">
              취소
            </IFRSGoalButton>
            <IFRSGoalButton
              onClick={handleSubmit}
              disabled={submitting}
              icon={
                submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              size="sm">
              {submitting ? '저장 중...' : '저장하기'}
            </IFRSGoalButton>
          </div>
        }>
        <div className="space-y-4">
          {/* 기본 정보 섹션 */}
          <Card className="shadow-sm border-customGBorder">
            <CardHeader className="pb-2 bg-gradient-to-r from-customGLight to-white">
              <CardTitle className="flex items-center text-lg text-customGText">
                <Calendar className="w-5 h-5 mr-2 text-customG" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CustomSelect
                  placeholder="산업군 선택"
                  options={industrialSectorOptions}
                  value={industrialSector}
                  onValueChange={setIndustrialSector}
                />

                <InputBox
                  label="기준 년도"
                  value={baseYear}
                  onChange={e => handleNumberChange(e.target.value, setBaseYear)}
                  className="border-customGBorder200 focus-within:ring-customGRing"
                />

                <InputBox
                  label="목표 년도"
                  value={targetYear}
                  onChange={e => handleNumberChange(e.target.value, setTargetYear)}
                  className="border-customGBorder200 focus-within:ring-customGRing"
                />
              </div>
            </CardContent>
          </Card>

          {/* 자산 항목 섹션 헤더 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <Landmark className="w-5 h-5 text-customG" />
              <h3 className="text-lg font-medium text-customGText">
                투자/대출 포트폴리오
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addAssetItem}
              className="flex items-center gap-1 text-customG border-customGBorder200 hover:bg-customGLight">
              <PlusCircle className="w-4 h-4" /> 자산 추가
            </Button>
          </div>

          {/* 자산 항목 목록 */}
          <div className="space-y-4">
            <AnimatePresence>
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, height: 0, overflow: 'hidden'}}
                  transition={{duration: 0.2}}>
                  <Card className="overflow-hidden transition-shadow duration-200 border-l-4 shadow-sm border-l-customG hover:shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-customGLight text-customGTextDark hover:bg-customGBorder">
                            #{index + 1}
                          </Badge>
                          <h4 className="text-sm font-medium text-customGTextLight">
                            자산 항목
                          </h4>
                          {asset.assetType && (
                            <div className="flex items-center">
                              {getAssetTypeIcon(asset.assetType)}
                              <span className="ml-1 text-xs text-customG">
                                {asset.assetType}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAssetItem(asset.id)}
                          className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CustomSelect
                          placeholder="산업 분야 선택"
                          options={industryOptions}
                          value={asset.industry}
                          onValueChange={value =>
                            updateAssetItem(asset.id, 'industry', value)
                          }
                        />

                        <CustomSelect
                          placeholder="자산 유형 선택"
                          options={assetTypeOptions}
                          value={asset.assetType}
                          onValueChange={value =>
                            updateAssetItem(asset.id, 'assetType', value)
                          }
                        />

                        <InputBox
                          label="투자액/대출액 (원)"
                          value={asset.amount}
                          onChange={e =>
                            handleAssetNumberChange(asset.id, 'amount', e.target.value)
                          }
                          className="border-customGBorder200 focus-within:ring-customGRing"
                        />

                        <InputBox
                          label="총 자산/총 사업비/기업가치 (원)"
                          value={asset.totalAssetValue}
                          onChange={e =>
                            handleAssetNumberChange(
                              asset.id,
                              'totalAssetValue',
                              e.target.value
                            )
                          }
                          className="border-customGBorder200 focus-within:ring-customGRing"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-center w-full pt-4">
            <DashButton
              width="w-32"
              onClick={handleSubmit}
              disabled={submitting}
              className="text-white transition-all shadow-md bg-gradient-to-r from-customG to-customGRing hover:from-customGDark hover:to-customG hover:shadow-lg">
              {submitting ? (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  저장 중...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="w-4 h-4 mr-2" /> 저장하기
                </span>
              )}
            </DashButton>
          </div>
        </div>
      </IFRSGoalFormCard>
    </motion.div>
  )
}
