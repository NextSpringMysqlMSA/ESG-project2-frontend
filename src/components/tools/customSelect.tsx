import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

type CustomSelectProps = {
  placeholder: string
  options: string[]
  value?: string | null
  onValueChange: (value: string) => void
}

export default function CustomSelect({
  placeholder,
  options,
  value,
  onValueChange
}: CustomSelectProps) {
  return (
    <Select value={value ?? undefined} onValueChange={onValueChange}>
      <SelectTrigger className="w-full focus-visible:ring-customG">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
