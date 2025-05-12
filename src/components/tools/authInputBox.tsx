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
    />
  )
}
