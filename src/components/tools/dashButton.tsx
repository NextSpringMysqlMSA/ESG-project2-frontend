import {ButtonHTMLAttributes} from 'react'

type DashButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  width?: string
  className?: string
}

export default function DashButton({
  children,
  width = 'w-full',
  className = '',
  ...props
}: DashButtonProps) {
  return (
    <button
      className={`flex items-center justify-center p-2 text-white transition-all duration-200 border rounded-xl ${width} ${
        className ||
        'bg-customG border-customG hover:bg-white hover:text-customG hover:border-customG'
      }`}
      {...props}>
      {children}
    </button>
  )
}
