'use client'

import {Line} from 'react-chartjs-2'
import {useEffect, useState} from 'react'
import {fetchNetZeroEmission} from '@/services/dashboard'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import type {ChartOptions, TooltipItem, ChartData} from 'chart.js'

// Chart.js 요소 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels // datalabels 플러그인 등록
)

interface EmissionItem {
  year: number
  emission: number
}

interface NetZeroChartProps {
  refreshTrigger?: number
}

export default function NetZeroChart({refreshTrigger = 0}: NetZeroChartProps) {
  const [data, setData] = useState<EmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchNetZeroEmission()
        if (Array.isArray(res) && res.length > 0) {
          // 연도 기준으로 오름차순 정렬
          const sortedData = [...res].sort((a, b) => a.year - b.year)
          setData(sortedData)
        } else {
          setError('데이터가 없습니다')
          setData([])
        }
      } catch (err) {
        console.error('넷제로 배출량 데이터를 불러오는 데 실패했습니다.', err)
        setError('데이터를 불러오는 데 실패했습니다')
        setData([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [refreshTrigger])

  // 직선형 목표 경로 계산 (첫 값에서 마지막 값까지 직선)
  const calculateTargetPath = () => {
    if (data.length < 2) return []

    const firstValue = data[0].emission
    const lastValue = data[data.length - 1].emission
    const totalSteps = data.length - 1

    return data.map((_, index) => {
      return firstValue - (firstValue - lastValue) * (index / totalSteps)
    })
  }

  // 데이터셋에 datalabels 속성 제거하고 옵션에서 처리
  const lineData: ChartData<'line'> = {
    labels: data.map(item => item.year.toString()),
    datasets: [
      {
        label: ' CO₂e 배출량',
        data: data.map(item => item.emission),
        borderColor: '#4bc0c0',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#059669',
        pointBorderWidth: 2,
        fill: true
      },
      {
        label: ' 목표 경로',
        data: calculateTargetPath(),
        borderColor: '#4bc0c0',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        tension: 0.1,
        pointRadius: 0,
        fill: false
      }
    ]
  }

  // options 부분 수정
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          padding: 15
        }
      },
      tooltip: {
        enabled: true, // 툴팁 활성화 유지
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const value = context.raw as number
            return `${context.dataset.label}: ${value.toLocaleString()} tCO₂e`
          }
        }
      },
      title: {
        display: false // 제목은 카드 헤더에 있으므로 여기서는 표시 안 함
      },
      datalabels: {
        // 데이터 라벨 표시 조건: 첫 번째 데이터셋(실제 배출량)에만 표시
        display: function (context) {
          return context.datasetIndex === 0
        },
        align: -10,
        anchor: 'end',
        offset: 4,
        color: '#059669',
        font: {
          size: 10,
          weight: 'bold'
        },
        formatter: (value: number) => {
          return value.toLocaleString()
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => Number(value).toLocaleString(),
          font: {size: 8}
        },
        grid: {color: 'rgba(0, 0, 0, 0.05)'},
        title: {
          display: true,
          text: 'tCO₂e',
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {size: 8, weight: 'bold'}
        },
        grid: {display: false},
        title: {
          display: true,
          text: '연도',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-8 h-8 border-2 border-t-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
        <p className="mb-2 text-gray-600">{error || '넷제로 배출량 데이터가 없습니다'}</p>
        <p className="text-xs text-gray-400">
          IFRS S2 Net Zero 섹션에서 목표를 설정하시면 이곳에 표시됩니다
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Line data={lineData} options={options} />
      <div className="pt-2 mt-2 text-xs text-right text-gray-500">
        <span>
          {Math.round(
            ((data[0].emission - data[data.length - 1].emission) / data[0].emission) * 100
          )}
          % 감축 ({data[0].year} → {data[data.length - 1].year})
        </span>
      </div>
    </div>
  )
}
