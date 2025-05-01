'use client'

import {useState} from 'react'

type InputBoxProps = {
  label?: string
  className?: string
  id?: string
}

export default function InputBox({
  label = '',
  className = '',
  id = 'input-box'
}: InputBoxProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const shouldFloat = value.length > 0 || isFocused

  return (
    <div className="relative w-full">
      <input
        type="text"
        id={id}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={e => setValue(e.target.value)}
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
