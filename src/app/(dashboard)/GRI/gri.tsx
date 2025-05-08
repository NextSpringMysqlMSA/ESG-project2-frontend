'use client'

import {useState} from 'react'
import {Check} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Command, CommandGroup, CommandItem, CommandList} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import GRI2 from './(tables)/gri2'
import GRI3 from './(tables)/gri3'
import GRI200 from './(tables)/gri200'
import GRI300 from './(tables)/gri300'
import GRI400 from './(tables)/gri400'

// ✅ key는 내부 처리용, label은 사용자에게 보여질 이름
const tableOptions = [
  {key: 'GRI2', label: 'GRI 2: 일반표준'},
  {key: 'GRI3', label: 'GRI 3: 일반표준'},
  {key: 'GRI200', label: 'GRI 200: 경제'},
  {key: 'GRI300', label: 'GRI 300: 환경'},
  {key: 'GRI400', label: 'GRI 400: 사회'}
]

const tableComponents: Record<string, React.FC> = {
  GRI2,
  GRI3,
  GRI200,
  GRI300,
  GRI400
}

// ✅ Combobox 컴포넌트
function TableCombobox({
  options,
  value,
  onChange,
  placeholder
}: {
  options: {key: string; label: string}[]
  value: string | null
  onChange: (value: string) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)

  const selected = options.find(option => option.key === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {selected?.label || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.key}
                  value={option.key}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.key ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// ✅ 메인 GRI 컴포넌트
export default function GRI() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-full h-full px-8 py-6 space-y-4 bg-[#F9FBFF]">
      <div className="flex flex-row px-4">ESG 공시 &gt; GRI</div>
      <div className="flex flex-row w-full px-4 mb-4">
        <span className="text-xl font-bold">GRI</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 space-y-4 bg-white border rounded">
        <div className="flex flex-row space-x-4">
          <TableCombobox
            options={tableOptions}
            value={selectedTable}
            onChange={setSelectedTable}
            placeholder="테이블 선택"
          />
        </div>

        {selectedTable ? (
          <div className="flex flex-col">
            <div className="flex w-full h-full">
              {(() => {
                const TableComponent = tableComponents[selectedTable]
                return TableComponent ? (
                  <TableComponent />
                ) : (
                  <p>해당 테이블 컴포넌트를 찾을 수 없습니다.</p>
                )
              })()}
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center w-full h-64">
            테이블을 선택해주세요.
          </div>
        )}
      </div>
    </div>
  )
}
