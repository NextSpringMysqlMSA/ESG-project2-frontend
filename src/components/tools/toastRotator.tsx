'use client'

import {useEffect, useState} from 'react'
import {AlertTriangle} from 'lucide-react'
import {AnimatePresence, motion} from 'framer-motion'

const toastItems = [
  {
    message:
      'https://n.news.naver.com/article/999/0000123456?cds=news_media_pc&type=editn'
  },
  {
    message:
      'https://n.news.naver.com/article/888/0000098765?cds=news_media_pc&type=editn'
  },
  {
    message:
      'https://n.news.naver.com/article/777/0000012345?cds=news_media_pc&type=editn'
  }
]

export default function ToastRotator() {
  const [current, setCurrent] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false) // 트리거 애니메이션 아웃
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % toastItems.length)
        setShow(true) // 다음 토스트 트리거 인
      }, 400) // 애니메이션 아웃 시간
    }, 4000) // 전체 주기

    return () => clearInterval(interval)
  }, [])

  const toast = toastItems[current]

  return (
    <div className="absolute z-30 right-72 bottom-20">
      <AnimatePresence mode="wait">
        {show && (
          <motion.div
            key={current}
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.4}}
            className="w-[350px] p-4 bg-white shadow-xl rounded-xl border border-gray-200">
            <div className="flex items-start">
              <div className="flex flex-col w-full h-full pl-4 border-l-8 border-red-500">
                <div className="flex flex-row w-full h-full space-x-4">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-semibold">협력사 부정 평사 기사 발견</h3>
                </div>
                <p className="text-sm text-gray-600 break-all">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
