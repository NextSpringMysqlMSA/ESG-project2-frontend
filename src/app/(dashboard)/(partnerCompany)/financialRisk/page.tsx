'use client'

import FinancialRiskForm from './financialRiskForm'
import { PageHeader } from '@/components/layout/PageHeader'
import { Building2, AlertTriangle } from 'lucide-react'

export default function FinancialRiskPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={<Building2 className="h-8 w-8" />}
        title="파트너사 재무 위험 분석"
        description="파트너사의 재무 지표를 기반으로 위험 수준을 분석합니다."
        module="CSDD"
      />
      
      <FinancialRiskForm />
    </div>
  )
}
