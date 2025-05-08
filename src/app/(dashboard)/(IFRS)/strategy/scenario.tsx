'use client'

import DashButton from '@/components/tools/dashButton'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useScenarioStore} from '@/stores/IFRS/strategy/useScenarioStore'
import {
  createScenario,
  updateScenario,
  deleteScenario,
  fetchScenarioList,
  CreateScenarioDto,
  UpdateScenarioDto
} from '@/services/strategy'
import {useEffect, useState} from 'react'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'

type ScenarioProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function Scenario({onClose, rowId, mode}: ScenarioProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)

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

  // 공통 작업 처리 함수 (중복 코드 제거)
  const handleAfterOperation = async () => {
    const updatedList = await fetchScenarioList()
    setData(updatedList)
    resetFields()
    onClose()
  }

  // API 오류 처리를 위한 공통 함수
  const handleApiError = (err: unknown) => {
    const errorMessage =
      axios.isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : '작업 실패: 서버 오류 발생'
    showError(errorMessage)
  }

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
      estimatedDamage: 0
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        // 수정 모드
        const updateData: UpdateScenarioDto = {...scenarioData, id: rowId}
        await updateScenario(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        // 추가 모드
        await createScenario(scenarioData)
        showSuccess('저장되었습니다.')
      }

      // 공통 작업 호출
      await handleAfterOperation()
    } catch (err) {
      handleApiError(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!rowId) return

    try {
      setSubmitting(true)
      await deleteScenario(rowId)
      showSuccess('삭제되었습니다.')

      // 공통 작업 호출
      await handleAfterOperation()
    } catch (err) {
      handleApiError(err)
    } finally {
      setSubmitting(false)
    }
  }

  // 선택 옵션 정의
  // 1. 산업 분야 옵션
  const industryOptions = ['ICT / 통신']

  // 2. 기후 지표 옵션
  const climateOptions = ['태풍', '홍수', '폭염', '가뭄']

  // 3. 행정구역 옵션
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

  // 6. SSP 시나리오 옵션
  const scenarioOptions = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']

  // 9. 분석 기준 연도 옵션
  const baseYearOptions = ['2020', '2025', '2030', '2040', '2050']

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex w-full">
        {/* 왼쪽 영역 */}
        <div className="flex flex-col w-[50%] mr-2 space-y-4">
          {/* 1. 산업 분야 */}
          <CustomSelect
            placeholder="산업 분야 선택"
            options={industryOptions}
            value={industry}
            onValueChange={value => setField('industry', value)}
          />

          {/* 2. 기후 지표 */}
          <CustomSelect
            placeholder="기후 지표 선택"
            options={climateOptions}
            value={climate}
            onValueChange={value => setField('climate', value)}
          />

          {/* 3. 행정구역 */}
          <CustomSelect
            placeholder="행정구역 선택"
            options={regionOptions}
            value={regions}
            onValueChange={value => setField('regions', value)}
          />

          {/* 6. SSP 시나리오 */}
          <CustomSelect
            placeholder="SSP 시나리오 선택"
            options={scenarioOptions}
            value={scenario}
            onValueChange={value => setField('scenario', value)}
          />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex flex-col w-[50%] ml-2 space-y-4">
          {/* 4. 위도 */}
          <InputBox
            label="위도 (예: 37.56)"
            type="number"
            value={latitude || ''}
            onChange={e => setField('latitude', parseFloat(e.target.value) || 0)}
          />

          {/* 5. 경도 */}
          <InputBox
            label="경도 (예: 126.97)"
            type="number"
            value={longitude || ''}
            onChange={e => setField('longitude', parseFloat(e.target.value) || 0)}
          />

          {/* 8. 자산 가치 */}
          <InputBox
            label="자산 가치 입력"
            type="number"
            value={assetValue || 0}
            onChange={e => setField('assetValue', parseFloat(e.target.value) || 0)}
          />

          {/* 9. 분석 기준 연도 */}
          <CustomSelect
            placeholder="분석 기준 연도 선택"
            options={baseYearOptions}
            value={baseYear ? baseYear.toString() : ''}
            onValueChange={value => setField('baseYear', parseInt(value))}
          />
        </div>
      </div>

      {/* 자산 유형 - 맨 아래로 이동 */}
      <InputBox
        label="자산 유형"
        value={assetType || ''}
        onChange={e => setField('assetType', e.target.value)}
      />

      <div className="flex flex-row justify-center w-full gap-4">
        {isEditMode && (
          <DashButton
            width="w-24"
            className="text-white bg-red-500 border-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={submitting}>
            삭제
          </DashButton>
        )}
        <DashButton width="w-24" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '저장 중...' : isEditMode ? '수정' : '저장'}
        </DashButton>
      </div>
    </div>
  )
}
