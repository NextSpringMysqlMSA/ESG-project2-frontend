type InputBoxProps = {
  placeholder?: string
}

export default function InputBox({placeholder}: InputBoxProps) {
  return (
    <input
      placeholder={placeholder}
      className="flex items-center justify-between w-full px-3 py-2 text-sm bg-transparent border rounded-md shadow-sm h-9 whitespace-nowrap border-input ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
