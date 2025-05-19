'use client'
import {Pie} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import {fetchTcfdProgress} from '@/services/dashboard'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Badge} from '@/components/ui/badge'

// Chart.js 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend)

interface IfrsChartProps {
  refreshTrigger?: number
}

// API 응답 형식에 맞게 타입 정의
interface ProgressData {
  completedCount: number
  inCompletedCount: number // API 응답의 필드명에 맞춤
  totalCount: number
  completedRate: number
}

export default function IfrsChart({refreshTrigger = 0}: IfrsChartProps) {
  const [data, setData] = useState<ProgressData>({
    completedCount: 0,
    inCompletedCount: 0,
    totalCount: 0,
    completedRate: 0
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchTcfdProgress()
        setData(result)
      } catch (error) {
        console.error('TCFD 진행 상황을 불러오는 데 실패했습니다:', error)
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
        label: 'TCFD 작성 상태',
        data: [data.completedCount, data.inCompletedCount],
        backgroundColor: ['#6366f1', '#e0f2fe'],
        borderColor: ['#4f46e5', '#bae6fd'],
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
            <div className="w-8 h-8 border-2 border-t-2 border-indigo-200 rounded-full border-t-indigo-500 animate-spin"></div>
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
          <div className="w-3 h-3 mr-2 bg-indigo-500 rounded-full"></div>
          <span className="mr-2 text-sm">작성 완료</span>
          <span className="text-sm font-gmBold">
            {data.completedCount}개 ({data.completedRate}%)
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 mr-2 bg-blue-100 rounded-full"></div>
          <span className="mr-2 text-sm">미완료</span>
          <span className="text-sm font-gmBold">
            {data.inCompletedCount}개 ({100 - data.completedRate}%)
          </span>
        </div>
        <div className="pt-2 mt-2 text-xs text-right text-gray-500 border-t border-gray-100">
          <div className="p-1 text-xs font-normal text-indigo-600 border border-indigo-200 rounded-md shadow-sm bg-indigo-50">
            총 {data.totalCount}개 항목 중 {data.completedRate}% 완료
          </div>
        </div>
      </div>
    </div>
  )
}
