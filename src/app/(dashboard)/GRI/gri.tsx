'use client'

import {useState} from 'react'
import {Check} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Command, CommandGroup, CommandItem, CommandList} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import E1 from './(tables)/(Environmental)/E1'
import E2 from './(tables)/(Environmental)/E2'
import E3 from './(tables)/(Environmental)/E3'
import S1 from './(tables)/(Social)/S1'
import S2 from './(tables)/(Social)/S2'
import S3 from './(tables)/(Social)/S3'
import G1 from './(tables)/(Governance)/G1'
import G2 from './(tables)/(Governance)/G2'
import G3 from './(tables)/(Governance)/G3'

const fields = ['Environmental', 'Social', 'Governance']
const fieldTables = {
  Environmental: ['E1', 'E2', 'E3'],
  Social: ['S1', 'S2', 'S3'],
  Governance: ['G1', 'G2', 'G3']
}

function FieldCombobox({
  options,
  value,
  onChange,
  placeholder,
  disabled = false
}: {
  options: string[]
  value: string | null
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between">
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
//Fields&Tables -------------------------------------------------------------------------------
export default function GRI() {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const tableComponents: Record<string, React.FC> = {
    E1,
    E2,
    E3,
    S1,
    S2,
    S3,
    G1,
    G2,
    G3
  }

  // Reset table selection when field changes
  const handleFieldChange = (field: string) => {
    setSelectedField(field)
    setSelectedTable(null)
  }

  return (
    <div className="flex flex-col w-full h-full px-8 py-6 space-y-4 bg-[#F9FBFF]">
      <div className="flex flex-row px-4">ESG 공시 &gt; GRI</div>
      <div className="flex flex-row w-full px-4 mb-4">
        <span className="text-xl font-bold">GRI</span>
      </div>
      <div className="flex flex-col w-full h-full p-4 space-y-4 bg-white border rounded">
        <div className="flex flex-row space-x-4">
          <FieldCombobox
            options={fields}
            value={selectedField}
            onChange={handleFieldChange}
            placeholder="필드 선택"
          />
          <FieldCombobox
            options={
              selectedField ? fieldTables[selectedField as keyof typeof fieldTables] : []
            }
            value={selectedTable}
            onChange={setSelectedTable}
            placeholder="테이블 선택"
            disabled={!selectedField}
          />
        </div>
        {selectedField && selectedTable ? (
          <div className="flex flex-col">
            <span className="flex text-xl font-medium">
              {selectedField} - {selectedTable}
            </span>
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
            {!selectedField ? '필드를 선택해주세요.' : '테이블을 선택해주세요.'}
          </div>
        )}
      </div>
    </div>
  )
}
