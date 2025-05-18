'use client'

import {useEffect, useState} from 'react'
import {motion} from 'framer-motion'
import {LineChart, Save, Trash, AlertCircle, Loader2} from 'lucide-react'
import {useScenarioStore} from '@/stores/IFRS/strategy/useScenarioStore'
import {
  createScenario,
  updateScenario,
  deleteScenario,
  fetchScenarioList
} from '@/services/strategy'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {cn} from '@/lib/utils'

// UI 컴포넌트
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {Badge} from '@/components/ui/badge'
import {CreateScenarioDto, UpdateScenarioDto} from '@/types/IFRS/strategy'

type ScenarioProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Scenario({onClose, rowId, mode}: ScenarioProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const {
    regions,
    longitude,
    latitude,
    assetType,
    industry,
    scenario,
    baseYear,
    climate,
    assetValue,
    estimatedDamage,
    setField,
    setData,
    resetFields,
    initFromApi,
    initFromStorage,
    persistToStorage
  } = useScenarioStore()

  useEffect(() => {
    if (isEditMode && rowId !== undefined) {
      // 수정 모드: API에서 데이터 로드
      initFromApi(rowId)
    } else {
      // 추가 모드: 로컬 스토리지에서 데이터 로드
      initFromStorage()
    }

    // 언마운트 시 저장 (추가 모드인 경우만)
    return () => {
      if (!isEditMode) {
        persistToStorage()
      }
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage])

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (
      !regions ||
      !longitude ||
      !latitude ||
      !assetType ||
      !industry ||
      !scenario ||
      !baseYear ||
      !climate ||
      !assetValue
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const scenarioData: CreateScenarioDto = {
      regions: regions.trim(),
      longitude: longitude,
      latitude: latitude,
      assetType: assetType.trim(),
      industry: industry.trim(),
      scenario: scenario.trim(),
      baseYear: baseYear,
      climate: climate.trim(),
      assetValue: assetValue,
      estimatedDamage: estimatedDamage || 0
    }

    try {
      setSubmitting(true)
      if (isEditMode && rowId !== undefined) {
        // 수정 모드
        const updateData: UpdateScenarioDto = {...scenarioData, id: rowId}
        await updateScenario(rowId, updateData)
        showSuccess('시나리오가 성공적으로 수정되었습니다.')
      } else {
        // 추가 모드
        await createScenario(scenarioData)
        showSuccess('새 시나리오가 성공적으로 등록되었습니다.')
        localStorage.removeItem('scenario-storage')
      }

      const updatedList = await fetchScenarioList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '처리 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!rowId) return

    try {
      setSubmitting(true)
      await deleteScenario(rowId)
      showSuccess('시나리오가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchScenarioList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  // 선택 옵션 정의
  const industryOptions = ['ICT / 통신']
  const climateOptions = ['태풍', '홍수', '폭염', '가뭄']
  const regionOptions = [
    '서울특별시',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '제주특별자치도'
  ]
  const scenarioOptions = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']
  const baseYearOptions = ['2020', '2025', '2030', '2040', '2050']

  // 시나리오 종류에 따른 배지 색상
  const getScenarioColor = (scenario: string) => {
    if (scenario.includes('1-2.6')) return 'bg-green-100 text-green-700 border-green-200'
    if (scenario.includes('2-4.5')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (scenario.includes('3-7.0'))
      return 'bg-orange-100 text-orange-700 border-orange-200'
    if (scenario.includes('5-8.5')) return 'bg-rose-100 text-rose-700 border-rose-200'
    return 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col space-y-6">
      {/* 헤더 섹션 */}
      <div className="flex items-center pb-3 mb-2 border-b">
        <div className="p-2.5 rounded-full bg-blue-50 mr-3">
          <LineChart className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold">
            {isEditMode ? '시나리오 정보 수정' : '새 시나리오 등록'}
            {scenario && (
              <Badge variant="outline" className={`ml-2 ${getScenarioColor(scenario)}`}>
                {scenario}
              </Badge>
            )}
          </h3>
          <p className="text-sm text-gray-500">
            {isEditMode
              ? '기존 시나리오 정보를 수정합니다.'
              : '새로운 SSP 기후 시나리오 분석 정보를 입력해주세요.'}
          </p>
        </div>
      </div>

      {/* 폼 영역 */}

      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="scenario" className="flex items-center text-sm font-medium">
              SSP 시나리오
            </Label>
            <Select value={scenario} onValueChange={value => setField('scenario', value)}>
              <SelectTrigger
                id="scenario"
                className={cn(
                  'focus-visible:ring-customG',
                  !scenario ? 'border-gray-300' : 'border-gray-300'
                )}>
                <SelectValue placeholder="SSP 시나리오 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>SSP 시나리오</SelectLabel>
                  {scenarioOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      <div className="flex items-center">
                        <Badge className={getScenarioColor(option)}>{option}</Badge>
                        <span className="ml-2">
                          {option === 'SSP1-2.6'
                            ? '지속가능성'
                            : option === 'SSP2-4.5'
                            ? '중도'
                            : option === 'SSP3-7.0'
                            ? '지역 경쟁'
                            : '화석연료 의존'}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="baseYear" className="flex items-center text-sm font-medium">
              분석 기준 연도
            </Label>
            <Select
              value={baseYear ? baseYear.toString() : ''}
              onValueChange={value => setField('baseYear', parseInt(value))}>
              <SelectTrigger
                id="baseYear"
                className={cn(
                  'focus-visible:ring-customG',
                  !baseYear ? 'border-gray-300' : 'border-gray-300'
                )}>
                <SelectValue placeholder="분석 기준 연도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>분석 기준 연도</SelectLabel>
                  {baseYearOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}년
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="regions" className="flex items-center text-sm font-medium">
              행정구역
            </Label>
            <Select value={regions} onValueChange={value => setField('regions', value)}>
              <SelectTrigger
                id="regions"
                className={cn(
                  'focus-visible:ring-customG',
                  !regions ? 'border-gray-300' : 'border-gray-300'
                )}>
                <SelectValue placeholder="행정구역 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>행정구역</SelectLabel>
                  {regionOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="climate" className="flex items-center text-sm font-medium">
              기후 지표
            </Label>
            <Select value={climate} onValueChange={value => setField('climate', value)}>
              <SelectTrigger
                id="climate"
                className={cn(
                  'focus-visible:ring-customG',
                  !climate ? 'border-gray-300' : 'border-gray-300'
                )}>
                <SelectValue placeholder="기후 지표 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>기후 지표</SelectLabel>
                  {climateOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      <div className="flex items-center">
                        <span>{option}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="latitude" className="flex items-center text-sm font-medium">
              위도 (예: 37.56)
            </Label>
            <Input
              id="latitude"
              type="number"
              placeholder="위도 입력 (예: 37.56)"
              value={latitude || ''}
              onChange={e => setField('latitude', parseFloat(e.target.value) || 0)}
              className={cn(
                'focus-visible:ring-customG',
                !latitude ? 'border-gray-300' : 'border-gray-300'
              )}
              step="0.01"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="longitude" className="flex items-center text-sm font-medium">
              경도 (예: 126.97)
            </Label>
            <Input
              id="longitude"
              type="number"
              placeholder="경도 입력 (예: 126.97)"
              value={longitude || ''}
              onChange={e => setField('longitude', parseFloat(e.target.value) || 0)}
              className={cn(
                'focus-visible:ring-customG',
                !longitude ? 'border-gray-300' : 'border-gray-300'
              )}
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="industry" className="flex items-center text-sm font-medium">
              산업 분야
            </Label>
            <Select value={industry} onValueChange={value => setField('industry', value)}>
              <SelectTrigger
                id="industry"
                className={cn(
                  'focus-visible:ring-customG',
                  !industry ? 'border-gray-300' : 'border-gray-300'
                )}>
                <SelectValue placeholder="산업 분야 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>산업 분야</SelectLabel>
                  {industryOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="assetValue" className="flex items-center text-sm font-medium">
              자산 가치 (원)
            </Label>
            <Input
              id="assetValue"
              placeholder="자산 가치 입력 (예: 10,000,000)"
              value={
                typeof assetValue === 'number' ? assetValue.toLocaleString('ko-KR') : '0'
              }
              onChange={e => {
                // Remove non-numeric characters for processing
                const numericValue = e.target.value.replace(/[^0-9]/g, '')
                setField('assetValue', numericValue ? parseFloat(numericValue) : 0)
              }}
              className={cn(
                'focus-visible:ring-customG',
                !assetValue ? 'border-gray-300' : 'border-gray-300'
              )}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="assetType" className="flex items-center text-sm font-medium">
            자산 유형
          </Label>
          <Input
            id="assetType"
            placeholder="자산 유형 입력 (예: 사무실 건물, 물류 창고, 생산 설비 등)"
            value={assetType || ''}
            onChange={e => setField('assetType', e.target.value)}
            className={cn(
              'focus-visible:ring-customG',
              !assetType ? 'border-gray-300' : 'border-gray-300'
            )}
          />
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center justify-between pt-2 mt-2 space-x-3">
        {isEditMode && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="gap-1 text-red-600 bg-white border border-red-600 hover:bg-red-600 hover:text-white"
                disabled={submitting}>
                <Trash className="w-4 h-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-red-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  시나리오 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 시나리오를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
                  관련 데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="transition-all hover:bg-gray-100">
                  취소
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="transition-all bg-red-600 hover:bg-red-700">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    '삭제'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex flex-row items-center justify-end w-full space-x-3 ">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="gap-1 transition-all hover:bg-gray-50">
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
                {isEditMode ? '저장하기' : '등록하기'}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
