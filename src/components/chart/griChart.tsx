'use client'
import {Pie} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import {fetchGriProgress} from '@/services/dashboard'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Badge} from '@/components/ui/badge'

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

interface GriChartProps {
  refreshTrigger?: number
}

// API 응답 형식에 맞게 타입 정의
interface ProgressData {
  totalCount: number
  completedCount: number
  incompleteCount: number
  completedRate: number
}

export default function GriChart({refreshTrigger = 0}: GriChartProps) {
  const [data, setData] = useState<ProgressData>({
    totalCount: 119,
    completedCount: 7,
    incompleteCount: 112,
    completedRate: 5
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchGriProgress()
        setData(result)
      } catch (error) {
        console.error('GRI 진행 상황을 불러오는 데 실패했습니다:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshTrigger])

  const chartData = {
    labels: ['작성 완료', '미완료'],
    datasets: [
      {
        label: 'GRI 작성 상태',
        data: [data.completedCount, data.incompleteCount],
        backgroundColor: ['#22c55e', '#dcfce7'],
        borderColor: ['#16a34a', '#bbf7d0'],
        borderWidth: 1,
        cutout: '70%',
        hoverOffset: 10
      }
    ]
  }

  const chartOptions = {
    plugins: {
      legend: {display: false},
      datalabels: {display: false},
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || ''
            const value = context.raw || 0
            const total = data.totalCount
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value}개 (${percentage}%)`
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="relative w-48 h-48">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="w-8 h-8 border-2 border-t-2 border-green-200 rounded-full border-t-green-500 animate-spin"></div>
          </div>
        ) : (
          <>
            <Pie data={chartData} options={chartOptions} />
            <div className="absolute text-3xl text-center transform -translate-x-1/2 -translate-y-1/2 font-gmBold top-1/2 left-1/2">
              {data.completedRate}%
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
          <span className="mr-2 text-sm">작성 완료</span>
          <span className="text-sm font-gmBold">
            {data.completedCount}개 ({data.completedRate}%)
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-green-100 rounded-full"></div>
          <span className="mr-2 text-sm">미완료</span>
          <span className="text-sm font-gmBold">
            {data.incompleteCount}개 ({100 - data.completedRate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal text-green-600 border border-green-200 rounded-md shadow-sm bg-green-50">
            총 {data.totalCount}개 항목 중 {data.completedRate}% 완료
          </div>
        </div>
      </div>
    </div>
  )
}
