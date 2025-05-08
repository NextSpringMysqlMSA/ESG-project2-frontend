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
    warming,
    industry,
    scenario,
    baseYear,
    climate,
    damage,
    format,
    responseStrategy,
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
    if (
      !regions ||
      !longitude ||
      !latitude ||
      !warming ||
      !industry ||
      !scenario ||
      !baseYear ||
      !climate ||
      !damage ||
      !format ||
      !responseStrategy
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const scenarioData: CreateScenarioDto = {
      regions: regions.trim(),
      longitude: longitude,
      latitude: latitude,
      warming: warming.trim(),
      industry: industry.trim(),
      scenario: scenario.trim(),
      baseYear: baseYear,
      climate: climate.trim(),
      damage: damage,
      format: format.trim(),
      responseStrategy: responseStrategy.trim()
    }

    try {
      setSubmitting(true)
      if (isEditMode && rowId !== undefined) {
        const updateData: UpdateScenarioDto = {...scenarioData, id: rowId}
        await updateScenario(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        await createScenario(scenarioData)
        showSuccess('저장되었습니다.')
      }

      const updatedList = await fetchScenarioList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류 발생'
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
      showSuccess('삭제되었습니다.')

      const updatedList = await fetchScenarioList()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류 발생'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

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
    '경기도',
    '강원특별자치도',
    '충청북도',
    '충청남도',
    '전북특별자치도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도'
  ]

  // 4. 위도 - InputBox 사용

  // 5. 경도 - InputBox 사용

  // 6. SSP 시나리오 옵션
  const scenarioOptions = ['SSP 시나리오', 'SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']

  // 7. 자산 유형 - InputBox 사용

  // 8. 자산 가치 - InputBox 사용

  // 9. 분석 기준 연도 옵션
  const baseYearOptions = ['분석기준연도', '2020', '2025', '2030', '2040', '2050']

  // 포맷 옵션 (추가 필드)
  const formatOptions = ['ASCill (텍스트 격자파일)', 'NetCDF (과학 격자자료)']

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex w-full">
        {/* 왼쪽 영역 */}
        <div className="flex flex-col w-[50%] mr-2 space-y-4">
          {/* 9. 분석 기준 연도 */}
          <CustomSelect
            placeholder="분석 기준 연도 선택"
            options={baseYearOptions}
            value={baseYear ? baseYear.toString() : ''}
            onValueChange={value => setField('baseYear', parseInt(value))}
          />
          {/* 1. 산업 분야 */}
          <CustomSelect
            placeholder="산업 분야 선택"
            options={industryOptions}
            value={industry}
            onValueChange={value => setField('industry', value)}
          />
          {/* 3. 행정구역 */}
          <CustomSelect
            placeholder="행정구역 선택"
            options={regionOptions}
            value={regions}
            onValueChange={value => setField('regions', value)}
          />
          <CustomSelect
            placeholder="SSP 시나리오 선택"
            options={scenarioOptions}
            value={scenario}
            onValueChange={value => setField('scenario', value)}
          />

          {/* 8. 자산 가치 */}
          <InputBox
            label="자산 유형"
            value={warming} // 백엔드 모델에서의 warming 필드를 자산 가치로 사용
            onChange={e => setField('warming', e.target.value)}
            // Remove helperText or update InputBox component to accept this prop
          />
        </div>
        <div className="flex flex-col w-[50%] mr-2 space-y-4">
          {/* 2. 기후 지표 */}
          <CustomSelect
            placeholder="기후 지표 선택"
            options={climateOptions}
            value={climate}
            onValueChange={value => setField('climate', value)}
          />

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
          {/* 7. 자산 유형 */}
          <InputBox
            label="자산 가치 입력"
            type="number"
            value={damage} // 백엔드 모델에서의 damage 필드를 자산 유형으로 사용
            onChange={e => setField('damage', e.target.value)}
            // Remove helperText or update InputBox component to accept this prop
          />
        </div>

        {/* 6. SSP 시나리오 */}
      </div>

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
