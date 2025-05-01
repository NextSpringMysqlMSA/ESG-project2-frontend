'use client'
import {Pie} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

export default function Home() {
  const data = {
    labels: ['미작성', '작성중', '작성완료'],
    datasets: [
      {
        label: '작성 상태',
        data: [3, 2, 5], // 예시: [미작성, 작성중, 작성완료]
        backgroundColor: ['#f87171', '#facc15', '#34d399'],
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
      title: {
        display: true,
        text: 'GRI',
        font: {
          size: 18
        },
        padding: {
          top: 30,
          bottom: 10
        }
      }
    }
  }

  return (
    <div className="flex flex-col w-full h-full p-8 justify-items-center">
      <div className="flex flex-row w-full h-full p-4 mb-4 bg-white">
        <div className="flex flex-col w-full h-full space-y-2">
          <div className="grid w-full grid-cols-2 gap-1">
            <div className="w-full h-full px-4 border-2">
              <Pie data={data} options={options} />
            </div>
            <div className="w-full h-full px-4 border-2">
              <Pie data={data} options={options} />
            </div>
          </div>

          <div className="grid w-full h-full grid-cols-3 gap-1">
            <div className="w-full h-full px-4 border-2">
              <Pie data={data} options={options} />
            </div>
            <div className="w-full h-full px-4 border-2">
              <Pie data={data} options={options} />
            </div>
            <div className="w-full h-full px-4 border-2">
              <Pie data={data} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
