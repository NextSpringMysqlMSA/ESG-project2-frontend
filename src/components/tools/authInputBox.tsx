interface AuthInputBoxProps {
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
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
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-customG"
    />
  )
}
