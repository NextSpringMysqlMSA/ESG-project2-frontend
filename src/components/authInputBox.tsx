type AuthInputBoxProps = {
  placeholder?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
}

export default function AuthInputBox({placeholder, type = 'text'}: AuthInputBoxProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 text-base border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
    />
  )
}
