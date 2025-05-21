'use client'

import {
  ArrowDown,
  Table2,
  TextCursorInput,
  ChartArea,
  AlertTriangle,
  ListChecks
} from 'lucide-react'
import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'

const toastItems = [
  {message: 'https://n.news.naver.com/article/666/0000123456'},
  {message: 'https://n.news.naver.com/article/777/0000098765'},
  {message: 'https://n.news.naver.com/article/888/0000012345'},
  {message: 'https://n.news.naver.com/article/999/0000043210'}
]

interface HeaderProps {
  onArrowClick: () => void
}

const icons = [Table2, TextCursorInput, ChartArea, AlertTriangle, ListChecks]

export default function Header({onArrowClick}: HeaderProps) {
  const [baseIndex, setBaseIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setBaseIndex(prev => (prev + 1) % toastItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getStack = () => {
    const stack = []
    for (let i = 0; i < 3; i++) {
      const idx = (baseIndex - i + toastItems.length) % toastItems.length
      stack.push(toastItems[idx])
    }
    return stack
  }

  const visibleToasts = getStack()

  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-64px)]">
      <div className="flex flex-col w-full max-w-screen-xl mt-16 md:space-y-32">
        {/* 헤더 글----------------------------------------------------------------------- */}
        <div className="flex flex-col w-full space-y-8 text-center">
          <h1 className="text-7xl font-gmBold">신뢰할 수 있는 ESG 데이터 플랫폼</h1>
          <h2 className="text-4xl">NSMM</h2>
          <p className="text-xl">정확한 분석, 실시간 알림, 공급망 리스크까지 한눈에.</p>
        </div>
        {/* 중간 요소 ------------------ */}
        <div className="flex flex-col items-center justify-center w-full md:mt-8 md:flex-row md:space-x-36">
          {/* 아이콘 바퀴 */}
          <div
            className="flex items-center justify-center w-[30%] h-[128px] md:h-[96px] py-6 overflow-hidden"
            style={{
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
              maskImage:
                'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
            }}>
            <div className="flex gap-12 animate-marquee whitespace-nowrap w-[200%]">
              {[...icons, ...icons, ...icons].map((Icon, idx) => (
                <Icon key={idx} className="w-12 h-12 text-gray-700 shrink-0" />
              ))}
            </div>
          </div>

          {/* 알림 스택 */}
          <div className="relative flex items-center w-[350px] h-[128px]">
            {' '}
            {/* 높이 맞춤 */}
            {visibleToasts.map((toast, index) => (
              <motion.div
                key={toast.message}
                initial={{opacity: 0, y: -40, scale: 0.95}}
                animate={{
                  opacity: 1 - index * 0.3,
                  y: -index * 28,
                  scale: 1 - index * 0.05
                }}
                transition={{duration: 0.5, ease: 'easeOut'}}
                className="absolute w-[350px] p-4 bg-white shadow-xl rounded-xl border border-gray-200 origin-bottom"
                style={{zIndex: 40 - index}}>
                <div className="flex items-start">
                  <div className="flex flex-col w-full h-full pl-4 border-l-8 border-red-500">
                    <div className="flex flex-row w-full h-full space-x-4">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <h3 className="text-base font-semibold">협력사 부정 평가 기사</h3>
                    </div>
                    <p className="text-sm text-gray-600 break-all">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* 아래쪽 화살표 -------------------------------------------------------------- */}
        <ArrowDown
          onClick={onArrowClick}
          className="w-12 h-12 mx-auto mt-24 cursor-pointer md:my-2 animate-bounce text-customG"
        />
      </div>
    </div>
  )
}
