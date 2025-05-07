'use client'
import {Line} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement // PointElement 임포트
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement
) // PointElement 등록

export default function NetZeroChart() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
    },
    scales: {
      y: {
        type: 'linear',
        beginAtZero: true
      },
      x: {
        type: 'category',
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
      }
    }
  }

  return <Line data={data} /> // options prop 추가
}
