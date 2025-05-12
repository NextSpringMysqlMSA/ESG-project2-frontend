import {ReactNode} from 'react'
import {Card, CardContent} from '@/components/ui/card'

type StatCardProps = {
  title: string
  count: number
  icon: ReactNode
  color: 'red' | 'blue' | 'emerald' | 'purple' | 'amber'
  description: string
}

/**
 * StatCard 컴포넌트
 *
 * 통계 정보를 표시하는 카드 컴포넌트입니다.
 */
export function StatCard({title, count, icon, color, description}: StatCardProps) {
  // 색상 클래스 매핑

  const colorVariants = {
    red: 'from-red-50 to-white border-red-200 text-red-500',
    blue: 'from-blue-50 to-white border-blue-200 text-blue-500',
    emerald: 'from-customGLight to-white border-customGBorder200 text-emerald-500',
    purple: 'from-purple-50 to-white border-purple-200 text-purple-500',
    amber: 'from-amber-50 to-white border-amber-200 text-amber-500'
  }

  return (
    <Card
      className={`border bg-gradient-to-r ${colorVariants[color]} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{count}</h3>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
          <div
            className={`p-2 rounded-full bg-white shadow-sm border ${
              color === 'emerald' ? 'border-customGBorder' : `border-${color}-100`
            }`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
