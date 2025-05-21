'use client'

import {useEffect, useRef, useState} from 'react'
import {AlertTriangle, X} from 'lucide-react'
import {fetchReminder} from '@/services/dashboard'
import clsx from 'clsx'

export default function Reminder() {
  const [visible, setVisible] = useState(false)
  const [toastUrl, setToastUrl] = useState<string | null>(null)
  const lastUrlRef = useRef<string | null>(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchReminder()
        const newUrl = data?.message?.trim()

        if (newUrl && newUrl !== lastUrlRef.current) {
          lastUrlRef.current = newUrl
          setToastUrl(newUrl)
          setVisible(true)

          setTimeout(() => {
            setVisible(false)
          }, 3000) // 3초 동안 표시
        }
      } catch (err) {
        console.error('Reminder fetch error:', err)
      }
    }, 1000) // 1초마다 폴링

    return () => clearInterval(interval)
  }, [])

  if (!toastUrl) return null

  return (
    <div
      onClick={() => window.open(toastUrl, '_blank')}
      className={clsx(
        'cursor-pointer fixed top-4 right-4 z-50 w-[350px] mt-16 p-4 bg-white shadow-xl rounded-xl border border-gray-200 transition-all duration-500',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      )}>
      <div className="flex items-start">
        <div className="flex flex-col w-full h-full pl-4 border-l-8 border-red-500">
          <div className="flex flex-row w-full h-full space-x-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-semibold">협력사 부정 평가 기사</h3>
          </div>
          <p className="text-sm text-blue-600 underline break-all">{toastUrl}</p>
        </div>
        <button
          onClick={e => {
            e.stopPropagation()
            setVisible(false)
          }}
          className="ml-2 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
