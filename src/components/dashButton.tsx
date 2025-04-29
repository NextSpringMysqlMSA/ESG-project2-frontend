import {ButtonHTMLAttributes} from 'react'

type DashButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  width?: string
}

export default function DashButton({
  children,
  width = 'w-full',
  ...props
}: DashButtonProps) {
  return (
    <button
      className={`flex items-center justify-center p-2 text-white transition-all duration-200 border bg-customG border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG ${width}`}
      {...props}>
      {children}
    </button>
  )
}
