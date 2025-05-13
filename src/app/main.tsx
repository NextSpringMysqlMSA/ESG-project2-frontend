'use client'

import {motion, useScroll, useTransform} from 'framer-motion'
import {ArrowDown} from 'lucide-react'
import {useState, useRef} from 'react'

const cards = [
  {
    title: 'ESG 프레임워크에 따른 데이터 관리',
    desc: '다양한 ESG 데이터 항목 관리',
    img: '/images/dashImage.jpg',
    gradient: 'from-blue-500/20 to-purple-500/20'
  },
  {
    title: '공급망 실사',
    desc: '공급망 내 리스크 파악 및 대응 정보 제공',
    img: '/images/dashImage.jpg',
    gradient: 'from-green-500/20 to-teal-500/20'
  },
  {
    title: '협력사 실사 관리',
    desc: '협력사 대상 실사 정보 관리 및 평가',
    img: '/images/dashImage.jpg',
    gradient: 'from-orange-500/20 to-red-500/20'
  }
]

export default function Main() {
  const containerRef = useRef(null)
  const {scrollYProgress} = useScroll({target: containerRef})

  // 카드 확대 및 축소용 transform 배열
  const scales = cards.map((_, i) =>
    useTransform(scrollYProgress, [i * 0.3, i * 0.3 + 0.15, (i + 1) * 0.3], [0.5, 1, 0.5])
  )
  const opacities = cards.map((_, i) =>
    useTransform(scrollYProgress, [i * 0.3, i * 0.3 + 0.15, (i + 1) * 0.3], [0, 1, 0])
  )

  return (
    <main ref={containerRef} className="absolute w-full h-[2000vh]">
      {/* 배경 패턴 추가 */}
      <div className="fixed w-full h-full bg-gradient-to-b from-customGStart to-white -z-50">
        <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
      </div>

      {/* 헤더 섹션 개선 */}
      <motion.section
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          y: useTransform(scrollYProgress, [0, 0.1], [0, -100])
        }}
        className="fixed flex flex-col items-center justify-center w-full h-screen px-4">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}>
            <h1 className="text-6xl font-extrabold text-transparent bg-gradient-to-r from-customG to-blue-600 bg-clip-text">
              신뢰할 수 있는 ESG 데이터 플랫폼
            </h1>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.3}}>
            <h2 className="text-4xl font-semibold tracking-wide text-customG">NSMM</h2>
          </motion.div>

          <motion.p
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.6}}
            className="text-xl leading-relaxed text-gray-700">
            정확한 분석, 실시간 알림, 공급망 리스크까지 한눈에.
          </motion.p>

          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 1, delay: 1}}
            className="mt-12 animate-bounce">
            <ArrowDown className="w-8 h-8 mx-auto text-customG" />
          </motion.div>
        </div>
      </motion.section>

      {/* 카드 섹션 개선 */}
      {cards.map((card, i) => (
        <motion.div
          key={i}
          style={{
            scale: scales[i],
            opacity: opacities[i]
          }}
          className="fixed top-[25%] left-[20%] right-[20%] bottom-[20%]">
          <div
            className={`
            flex flex-row items-center w-full h-full p-12 
            bg-gradient-to-br ${card.gradient} backdrop-blur-sm
            shadow-xl rounded-2xl border border-white/20
            transition-all duration-300 hover:shadow-2xl
          `}>
            <div className="flex flex-col w-full space-y-6 text-center">
              <h3 className="text-3xl font-bold text-gray-800">{card.title}</h3>
              <p className="text-xl text-gray-600">{card.desc}</p>
              <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className="px-8 py-3 mx-auto text-white transition-all rounded-full shadow-lg bg-customG hover:bg-opacity-90">
                자세히 보기
              </motion.button>
            </div>
            <div className="w-3/5 overflow-hidden shadow-2xl rounded-xl">
              <img
                src={card.img}
                alt={card.title}
                className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
              />
            </div>
          </div>
        </motion.div>
      ))}

      {/* 푸터 개선 */}
      <motion.footer
        style={{
          opacity: useTransform(scrollYProgress, [0.7, 0.7], [0, 1]),
          y: useTransform(scrollYProgress, [0.7, 0.7], [100, 0])
        }}
        className="absolute bottom-0 w-full p-12 text-sm text-white bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-wrap text-gray-300 gap-x-8 gap-y-3">
            <a href="#" className="transition-colors hover:text-customG">
              NSMM 소개
            </a>
            <a href="#" className="transition-colors hover:text-customG">
              기사제보
            </a>
            <a href="#" className="transition-colors hover:text-customG">
              광고문의
            </a>
            <a href="#" className="transition-colors hover:text-customG">
              개인정보취급방침
            </a>
            <a href="#" className="transition-colors hover:text-customG">
              청소년보호정책
            </a>
            <a href="#" className="transition-colors hover:text-customG">
              이메일무단수집거부
            </a>
          </div>
          <div className="text-gray-400 leading-relaxed text-[13px] border-t border-gray-700 pt-8">
            <p>
              서울특별시 강남구 강남대로94길 20 | 대표전화 : 02-1234-1234 | 팩스 :
              02-1234-1234
            </p>
            <p>대표자 : 지희연 | 청소년보호책임자 : 지희연</p>
            <p className="mt-4">
              ⓒ 2025 NSMM. 무단 전재 및 재배포 금지. Contact: nsmm@project.com
            </p>
          </div>
        </div>
      </motion.footer>
    </main>
  )
}
