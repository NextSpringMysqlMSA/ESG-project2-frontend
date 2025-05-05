'use client'

import {useState} from 'react'

type InputBoxProps = {
  label?: string
  className?: string
  id?: string
  value: string | number | null | undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

export default function InputBox({
  label = '',
  className = '',
  id = 'input-box',
  value,
  onChange,
  type = 'text'
}: InputBoxProps) {
  const [isFocused, setIsFocused] = useState(false)

  // value가 null 또는 undefined일 때는 빈 문자열 처리
  const inputValue = value != null ? value.toString() : ''

  const shouldFloat = inputValue.length > 0 || isFocused

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={inputValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={onChange}
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
