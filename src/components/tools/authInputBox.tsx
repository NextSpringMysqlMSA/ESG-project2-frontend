import {Dispatch, SetStateAction} from 'react'

interface AuthInputBoxProps {
  type: string
  placeholder: string
  value: string
  onChange: Dispatch<SetStateAction<string>> | ((value: string) => void)
}

export default function AuthInputBox({
  type,
  placeholder,
  value,
  onChange
}: AuthInputBoxProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full py-3 pl-10 pr-4 text-gray-700 transition-colors border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGRing focus:border-transparent"
    />
  )
}
