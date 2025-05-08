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
        console.log('Scenario Submitting update for ID:', rowId)
        const updateData: UpdateScenarioDto = {...scenarioData, id: rowId}
        await updateScenario(rowId, updateData)
        showSuccess('수정되었습니다.')
      } else {
        console.log('Scenario Creating new scenario')
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
      console.log('Scenario Deleting scenario ID:', rowId)
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

  const regions2 = [
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
  const warming2 = ['+1.5°C', '+2.0°C', '+3.0°C']
  const industry2 = [
    'ICT/통신',
    '에너지/전력',
    '물류/운송',
    '농업/식량',
    '건설/기반시설',
    '제조/공정'
  ]
  const scenario2 = ['SSP1-2.6', 'SSP2-4.5', 'SSP3-7.0', 'SSP5-8.5']
  const climate2 = [
    'TX90 (90th 백분위 고온일수)',
    'RX1D (1일 최대 강수량)',
    'WS90 (강풍일수, 상위 10%)',
    'TNx (연 최고기온)',
    'FD (결빙일수)',
    'D80 (80mm 초과 강수일)'
  ]
  const format2 = ['ASCill (텍스트 격자파일)', 'NetCDF (과학 격자자료)']

  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <div className="flex flex-col w-full space-y-4">
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-[50%] pr-2 space-y-4">
            <CustomSelect
              placeholder="행정구역 선택"
              options={regions2}
              value={regions}
              onValueChange={value => setField('regions', value)}
            />
            <InputBox
              label="경도 (예: 126.97)"
              value={longitude || ''}
              onChange={e => setField('longitude', parseFloat(e.target.value) || 0)}
            />
            <CustomSelect
              placeholder="온난화 수준"
              options={warming2}
              value={warming}
              onValueChange={value => setField('warming', value)}
            />
            <CustomSelect
              placeholder="산업 분야"
              options={industry2}
              value={industry}
              onValueChange={value => setField('industry', value)}
            />
            <InputBox
              label="분석 기준 연도 (예: 2030)"
              value={baseYear || ''}
              onChange={e => setField('baseYear', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex flex-col w-[50%] ml-2 space-y-4">
            <InputBox
              label="위도 (예: 37.56)"
              value={latitude || ''}
              onChange={e => setField('latitude', parseFloat(e.target.value) || 0)}
            />
            <CustomSelect
              placeholder="SSP 시나리오"
              options={scenario2}
              value={scenario}
              onValueChange={value => setField('scenario', value)}
            />
            <CustomSelect
              placeholder="기후 지표"
              options={climate2}
              value={climate}
              onValueChange={value => setField('climate', value)}
            />
            <CustomSelect
              placeholder="자료 포맷"
              options={format2}
              value={format}
              onValueChange={value => setField('format', value)}
            />
            <InputBox
              label="단위 피해(예: ₩/일 또는 ₩/mm)"
              value={damage || ''}
              onChange={e => setField('damage', parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>
        <InputBox
          label="대응 전략, 가정, 참고사항 입력 (예: RE100 전략, 저지대 배수로 개선 등)"
          value={responseStrategy}
          onChange={e => setField('responseStrategy', e.target.value)}
        />
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
