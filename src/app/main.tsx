'use client'

import {useRef} from 'react'
import {motion, useScroll, useTransform} from 'framer-motion'

const cards = [
  {
    title: 'ESG 프레임워크에 따른 데이터 관리',
    desc: '다양한 ESG 데이터 항목 관리',
    img: '/images/dashImage.jpg'
  },
  {
    title: '공급망 실사',
    desc: '공급망 내 리스크 파악 및 대응 정보 제공',
    img: '/images/dashImage.jpg'
  },
  {
    title: '협력사 실사 관리',
    desc: '협력사 대상 실사 정보 관리 및 평가',
    img: '/images/dashImage.jpg'
  }
]

export default function Main() {
  const containerRef = useRef(null)
  const {scrollYProgress} = useScroll({target: containerRef})

  // 카드 확대 및 축소용 transform 배열
  const scales = cards.map((_, i) =>
    useTransform(
      scrollYProgress,
      [i * 0.3, i * 0.3 + 0.15, (i + 1) * 0.3],
      [0.75, 1, 0.75]
    )
  )
  const opacities = cards.map((_, i) =>
    useTransform(scrollYProgress, [i * 0.3, i * 0.3 + 0.15, (i + 1) * 0.3], [0, 1, 0])
  )

  return (
    <main ref={containerRef} className="absolute w-full h-[400vh]">
      {/* 배경 고정 */}
      <div className="fixed w-full h-full bg-gradient-to-b from-customGStart to-white -z-50" />
      {/* 헤더 - 스크롤되며 사라짐 */}
      <motion.section
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          y: useTransform(scrollYProgress, [0, 0.1], [0, -100])
        }}
        className="fixed flex items-center justify-center w-full h-screen px-4 text-center">
        <div className="w-full space-y-6">
          <h1 className="w-full text-5xl font-extrabold">
            신뢰할 수 있는 ESG 데이터 플랫폼
          </h1>
          <h2 className="text-3xl font-semibold text-customG">NSMM</h2>
          <p className="text-xl text-gray-700 ">
            정확한 분석, 실시간 알림, 공급망 리스크까지 한눈에.
          </p>
        </div>
      </motion.section>

      {/* 카드들 - 확대/축소 */}
      {cards.map((card, i) => (
        <motion.div
          key={i}
          style={{
            scale: scales[i],
            opacity: opacities[i]
          }}
          className="fixed top-[25%] left-[20%] right-[20%] bottom-[20%]">
          <div className="flex flex-row items-center w-full h-full p-10 space-x-12 bg-white shadow-xl rounded-xl">
            <div className="flex flex-col w-full text-center">
              <h3 className="mb-4 text-2xl font-bold">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
            <img src={card.img} alt={card.title} className="w-3/5 h-auto rounded-lg" />
          </div>
        </motion.div>
      ))}

      {/* 푸터 */}
      <motion.footer
        style={{
          opacity: useTransform(scrollYProgress, [0.7, 0.7], [0, 1]),
          y: useTransform(scrollYProgress, [0.7, 0.7], [100, 0])
        }}
        className="absolute bottom-0 w-full bg-[#f8f8f8] p-12 text-sm border-t border-gray-300">
        <div className="max-w-4xl mx-auto space-y-4 text-gray-700">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>NSMM 소개</span>
            <span>기사제보</span>
            <span>광고문의</span>
            <span>개인정보취급방침</span>
            <span>청소년보호정책</span>
            <span>이메일무단수집거부</span>
          </div>
          <p className="leading-relaxed text-[13px]">
            서울특별시 강남구 강남대로94길 20 | 대표전화 : 02-1234-1234 | 팩스 :
            02-1234-1234 | 대표자 : 지희연 | 청소년보호책임자 : 지희연
            <br />ⓒ 2025 NSMM. 무단 전재 및 재배포 금지. Contact: nsmm@project.com
          </p>
        </div>
      </motion.footer>
    </main>
  )
}
