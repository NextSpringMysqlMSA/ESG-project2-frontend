'use client'
import {useState, useEffect} from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale
} from 'chart.js'
import {Pie, Line, Bar, PolarArea} from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {ArrowRight, TrendingUp, Award, Zap, Leaf, ChevronUp} from 'lucide-react'
import {motion} from 'framer-motion'

// 차트 설정
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ChartDataLabels
)

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // GRI 데이터
  const griData = {
    labels: ['작성 완료', '작성중', '미완료'],
    datasets: [
      {
        label: '작성 상태',
        data: [50, 30, 20],
        backgroundColor: [
          'rgba(74, 222, 128, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(220, 252, 231, 0.8)'
        ],
        borderColor: [
          'rgba(74, 222, 128, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(220, 252, 231, 1)'
        ],
        borderWidth: 1,
        cutout: '70%',
        borderRadius: 5,
        hoverOffset: 10
      }
    ]
  }

  // GRI 차트 옵션
  const griOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            return ` ${context.label}: ${context.raw}%`
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  }

  // IFRS S2 데이터
  const ifrsData = {
    labels: ['작성 완료', '작성중', '미완료'],
    datasets: [
      {
        label: '작성 상태',
        data: [50, 20, 30],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(224, 242, 254, 0.8)'
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(224, 242, 254, 1)'
        ],
        borderWidth: 1,
        cutout: '70%',
        borderRadius: 5,
        hoverOffset: 10
      }
    ]
  }

  // 협력사 ESG 데이터
  const supplierData = {
    labels: ['정보 수집 완료', '미수집'],
    datasets: [
      {
        label: '수집 현황',
        data: [80, 20],
        backgroundColor: ['rgba(159, 18, 57, 0.8)', 'rgba(254, 205, 211, 0.8)'],
        borderColor: ['rgba(159, 18, 57, 1)', 'rgba(254, 205, 211, 1)'],
        borderWidth: 1,
        cutout: '70%',
        borderRadius: 5,
        hoverOffset: 10
      }
    ]
  }

  // 협력사 세부 데이터
  const companyData = {
    labels: ['기업 A', '기업 B', '기업 C'],
    datasets: [
      {
        label: '진행률',
        data: [80, 30, 80],
        backgroundColor: [
          'rgba(159, 18, 57, 0.8)',
          'rgba(159, 18, 57, 0.6)',
          'rgba(159, 18, 57, 0.8)'
        ],
        borderColor: [
          'rgba(159, 18, 57, 1)',
          'rgba(159, 18, 57, 1)',
          'rgba(159, 18, 57, 1)'
        ],
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 25
      }
    ]
  }

  const companyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            return ` 진행률: ${context.raw}%`
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const
        },
        formatter: (value: any) => {
          return `${value}%`
        },
        display: function (context: any) {
          return context.dataset.data[context.dataIndex] >= 30
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  }

  // ESG Rating 데이터
  const currentRating = 'A'
  const targetRating = 'AA'
  const currentScore = 30
  const targetScore = 66.7

  // ESG 세부 점수 데이터
  const esgScoreData = {
    labels: ['환경(E)', '사회(S)', '지배구조(G)'],
    datasets: [
      {
        label: '목표 점수',
        data: [8, 7.5, 8.5],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(99, 102, 241, 0.5)',
        pointBorderColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 3
      },
      {
        label: '현재 점수',
        data: [7.5, 3, 7.5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(99, 102, 241, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        borderWidth: 1,
        pointBackgroundColor: '#fff',
        pointBorderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(99, 102, 241, 1)'
        ],
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const esgScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10
      },
      datalabels: {
        display: false
      }
    },
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  }

  // Net Zero 데이터
  const netZeroData = {
    labels: ['2024', '2026', '2030', '2050'],
    datasets: [
      {
        label: 'CO2e 배출량',
        data: [100000, 80000, 30000, 0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        fill: true
      },
      {
        label: '목표 배출량',
        data: [95000, 70000, 25000, 0],
        borderColor: 'rgba(59, 130, 246, 0.5)',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 0
      }
    ]
  }

  const netZeroOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || ''
            return `${label}: ${context.raw.toLocaleString()} tCO₂e`
          }
        }
      },
      datalabels: {
        display: function (context: any) {
          // 첫 번째 데이터셋만 표시
          return context.datasetIndex === 0
        },
        color: '#3b82f6',
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 4,
        font: {
          weight: 'bold' as const,
          size: 10
        },
        align: 'end' as const,
        offset: 10,
        formatter: function (value: any) {
          if (value === 0) return 'Net\nZero'
          return value.toLocaleString()
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function (value: any) {
            return value.toLocaleString()
          },
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10,
            weight: 'bold' as const
          }
        }
      }
    }
  }

  // Framer Motion 애니메이션 설정
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  // 퍼센트 표시 컴포넌트
  const PercentageDisplay = ({value}: {value: number}) => (
    <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <p className="text-4xl font-bold">{value}%</p>
    </div>
  )

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-gray-50">
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ESG 공시 대시보드</h1>
        <p className="text-gray-500">지속가능경영 보고서 및 기후 관련 정보 공시 현황</p>
      </motion.div>

      {/* 상단 두 개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* GRI 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden h-[320px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-customG">GRI 작성 현황</CardTitle>
                <Badge
                  variant="outline"
                  className="font-medium bg-customGLight text-customG border-customGLight">
                  50% 완료
                </Badge>
              </div>
              <CardDescription>
                Global Reporting Initiative 지표 작성 현황
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between h-[220px]">
                <div className="relative w-48 h-48 mx-auto">
                  {mounted && <Pie data={griData} options={griOptions} />}
                  <PercentageDisplay value={50} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-green-400 rounded-full"></div>
                    <span className="mr-2 text-sm">작성 완료</span>
                    <span className="text-sm font-bold">50.0%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-green-600 rounded-full"></div>
                    <span className="mr-2 text-sm">작성중</span>
                    <span className="text-sm font-bold">30.0%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-green-100 rounded-full"></div>
                    <span className="mr-2 text-sm">미완료</span>
                    <span className="text-sm font-bold">20.0%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* IFRS S2 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden h-[320px]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-indigo-600">
                  IFRS S2 (TCFD) 현황
                </CardTitle>
                <Badge
                  variant="outline"
                  className="font-medium text-indigo-600 border-indigo-200 bg-indigo-50">
                  50% 완료
                </Badge>
              </div>
              <CardDescription>기후 관련 공시(TCFD) 작성 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between h-[220px]">
                <div className="relative w-48 h-48 mx-auto">
                  {mounted && <Pie data={ifrsData} options={griOptions} />}
                  <PercentageDisplay value={50} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-indigo-600 rounded-full"></div>
                    <span className="mr-2 text-sm">작성 완료</span>
                    <span className="text-sm font-bold">50.0%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-blue-600 rounded-full"></div>
                    <span className="mr-2 text-sm">작성중</span>
                    <span className="text-sm font-bold">20.0%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-2 bg-blue-100 rounded-full"></div>
                    <span className="mr-2 text-sm">미완료</span>
                    <span className="text-sm font-bold">30.0%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 하단 세 개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* 협력사 ESG 정보 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="h-[360px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg text-rose-800">
                <Zap className="w-5 h-5 mr-2" />
                협력사 ESG 정보 수집 현황
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative w-32 h-32 mx-auto mb-6">
                {mounted && <Pie data={supplierData} options={griOptions} />}
                <PercentageDisplay value={80} />
              </div>

              <div className="h-[120px]">
                {mounted && <Bar data={companyData} options={companyOptions} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ESG Rating 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="h-[360px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                ESG Rating (MSCI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl font-bold text-gray-500">A</div>
                <ArrowRight className="w-10 h-10 mx-4 text-gray-400" />
                <div className="text-5xl font-bold text-indigo-600">AA</div>
              </div>

              <div className="mb-2 text-center">
                <Badge className="bg-indigo-500 hover:bg-indigo-600">
                  <ChevronUp className="w-3 h-3 mr-1" />
                  36.7점 상승 필요
                </Badge>
              </div>

              <div className="grid place-items-center h-[190px]">
                {mounted && <PolarArea data={esgScoreData} options={esgScoreOptions} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Net Zero 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="h-[360px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Leaf className="w-5 h-5 mr-2 text-blue-600" />
                Net Zero 달성 경로{' '}
                <span className="ml-2 text-xs font-normal">(단위:tCO₂e)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[290px]">
              {mounted && <Line data={netZeroData} options={netZeroOptions} />}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
