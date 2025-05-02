'use client'

import {useState, useEffect} from 'react'

type InputBoxProps = {
  label?: string
  className?: string
  id?: string
  value: string // 부모에서 전달받는 value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void // 부모에서 전달받는 onChange
}

export default function InputBox({
  label = '',
  className = '',
  id = 'input-box',
  value, // 부모로부터 value 받아옴
  onChange // 부모로부터 onChange 받아옴
}: InputBoxProps) {
  const [isFocused, setIsFocused] = useState(false)

  const shouldFloat = value.length > 0 || isFocused

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={id}
        value={value} // 전달받은 value 사용
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange} // 전달받은 onChange 사용
        className={`peer block w-full h-9 appearance-none rounded-lg border border-input bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-0 dark:text-white dark:focus:border-blue-500 ${className}`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute start-1 z-10 origin-[0] bg-white px-2 text-sm text-muted-foreground transition-all dark:bg-gray-900 ${
          shouldFloat
            ? 'top-0 scale-75 -translate-y-2.5'
            : 'top-1/2 scale-100 -translate-y-1/2'
        }`}>
        {label}
      </label>
    </div>
  )
}
