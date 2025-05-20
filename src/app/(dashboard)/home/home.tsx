'use client'
import {useState, useEffect, useCallback} from 'react'
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
import {Pie, Bar, PolarArea} from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Zap,
  Leaf,
  ChevronUp,
  RefreshCcw,
  FileText,
  CloudSun,
  TrendingUp
} from 'lucide-react'
import {motion} from 'framer-motion'
import GriChart from '@/components/chart/griChart'
import IfrsChart from '@/components/chart/IfrsChart'
import NetZeroChart from '@/components/chart/netZeroChart'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

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
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // 데이터 새로고침 함수
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // 차트 옵션
  const chartOptions = {
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

  // 애니메이션 효과로 현재 날짜 표시
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-gray-50">
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl tracking-tight text-gray-800 font-gmBold">
            ESG 공시 대시보드
          </h1>
          <p className="text-gray-500">
            {currentDate} 기준 지속가능경영 보고서 및 기후 관련 정보 공시 현황
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-1 mt-2 text-gray-500 hover:text-gray-700 md:mt-0">
          <RefreshCcw className="w-4 h-4" />
          데이터 새로고침
        </Button>
      </motion.div>
      {/* 상단 두 개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* IFRS S2 섹션 */}
        <motion.div variants={itemVariants}>
          <Link href="/governance">
            <Card className="overflow-hidden h-[320px] hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CloudSun className="w-5 h-5 text-indigo-600" />
                    <span className="text-xl text-indigo-800">IFRS S2 (TCFD) 현황</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-indigo-700 bg-indigo-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>기후 관련 공시(TCFD) 작성 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between h-[220px]">
                  {mounted && <IfrsChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* GRI 섹션 */}
        <motion.div variants={itemVariants}>
          <Link href="/GRI">
            <Card className="overflow-hidden h-[320px] hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-xl text-green-800">GRI 작성 현황</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-green-700 bg-green-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>
                  Global Reporting Initiative 지표 작성 현황
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between h-[220px]">
                  {mounted && <GriChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
      {/* 하단 세 개 카드 */}
      <motion.div
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible">
        {/* Net Zero 섹션 */}
        <motion.div variants={itemVariants}>
          <Link href="/goal">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg text-[#4bc0c0]">
                  <Leaf className="w-5 h-5 mr-2 text-[#4bc0c0]" />
                  Net Zero 달성 경로
                  <span className="ml-2 text-xs font-normal">(단위:tCO₂e)</span>
                </CardTitle>
                <CardDescription className="text-gray-500">
                  탄소 중립 목표 및 감축 경로
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                {mounted && <NetZeroChart refreshTrigger={refreshTrigger} />}
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        {/* 협력사 ESG 정보 섹션 */}
        <motion.div variants={itemVariants}>
          <Link href="/financialRisk">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg text-rose-800">
                  <Zap className="w-5 h-5 mr-2 text-rose-600" />
                  협력사 ESG 정보 수집 현황
                </CardTitle>
                <CardDescription className="text-gray-500">
                  주요 협력사 ESG 정보 수집 진행률
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative mx-auto mb-8 w-36 h-36">
                  {mounted && <Pie data={supplierData} options={chartOptions} />}
                  <div className="absolute text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <p className="text-2xl font-gmBold text-rose-800">80%</p>
                  </div>
                </div>

                <div className="h-[150px]">
                  {mounted && <Bar data={companyData} options={companyOptions} />}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        {/* ESG Rating 섹션 */}
        <motion.div variants={itemVariants}>
          <Card className="h-full overflow-hidden transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg text-purple-800">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                ESG Rating (MSCI)
              </CardTitle>
              <CardDescription className="text-gray-500">
                ESG 등급 및 개선 목표
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-5xl text-gray-500 font-gmBold">A</div>
                <ArrowRight className="w-12 h-12 mx-4 text-gray-400" />
                <div className="text-5xl text-purple-600 font-gmBold">AA</div>
              </div>

              <div className="flex justify-center mb-6 text-center">
                <div className="flex flex-row px-3 py-1.5 bg-purple-500 rounded-lg items-center">
                  <ChevronUp className="w-3 h-3 mr-1 text-white" />
                  <span className="text-sm text-white">36.7점 상승 필요</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid place-items-center h-[200px]">
                {mounted && <PolarArea data={esgScoreData} options={esgScoreOptions} />}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
