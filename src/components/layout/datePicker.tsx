'use client'

import React from 'react'
import {Calendar} from '@/components/ui/calendar'
import {CalendarIcon} from 'lucide-react'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {Button} from '@/components/ui/button'
import {Popover, PopoverTrigger, PopoverContent} from '@/components/ui/popover'

interface Props {
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  participantCount: number
  onCountChange: (count: number) => void
}

export function DatePickerForm({
  date,
  onDateChange,
  participantCount,
  onCountChange
}: Props) {
  return (
    <div className="flex space-x-8">
      <div className="flex flex-col">
        <label className="mb-1 font-medium">교육 날짜</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] pl-4 text-left font-normal">
              {date ? (
                format(date, 'PPP', {locale: ko})
              ) : (
                <span>교육 날짜를 선택하세요.</span>
              )}
              <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={d => d < new Date('1900-01-01')}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="mt-1 text-sm text-muted-foreground">교육 날짜를 선택하세요.</p>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium">교육 인원</label>
        <input
          placeholder="1"
          className="w-[240px] h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={participantCount}
          onChange={e => {
            const val = parseInt(e.target.value)
            onCountChange(Number.isNaN(val) ? 0 : val)
          }}
        />
        <p className="mt-1 text-sm text-muted-foreground">인원수를 입력하세요.</p>
      </div>
    </div>
  )
}
