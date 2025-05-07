'use client'

import {useState} from 'react'
import {Label} from '@/components/ui/label'
import {Check} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Card, CardContent} from '@/components/ui/card'
import DashButton from '@/components/tools/dashButton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

const partners = ['협력사 A', '협력사 B', '협력사 C', '협력사 D', '협력사 E']

const questions = [
  '매출이 지난 해 같은 기간 대비 30% 이상 감소하였는가?',
  '영업이익(흑자)이 지난 해 같은 기간 대비 30% 이상 감소하였는가?',
  '매출채권회전율이 3회 이하이며 매출채권이 과대하게 쌓였는가?',
  '매출액 대비 매출채권 비율이 50% 이상으로 과다한가?',
  '매출액 대비 재고자산 비율이 30% 이상이며 미래재무구가 과다한가?',
  '영업손실(적자)이 발생하였는가?',
  '불충족자본비율산정 영업활동 후의 현금흐름에 적자가 발생하였는가?',
  '차입금이 지난 해 같은 기간 대비 30% 이상 증가하였는가?',
  '차입금의 Volume이 전체 자산의 50% 이상 차지할 정도로 과다한가?',
  '전체 사업의 총 단기차입금의 규모가 90%이상으로 과다한가?',
  '재무비율이 200% 이상으로 과다한가?',
  '납입자본금의 잠식이 발생하였는가?'
]

const partnerQuestionMap: {[key: string]: number[]} = {
  '협력사 A': [],
  '협력사 B': [1, 5, 10],
  '협력사 C': [0, 2, 3, 4, 6, 8, 9, 11],
  '협력사 D': [1],
  '협력사 E': [2, 4, 5, 8]
}

function getStatusLabel(count: number) {
  if (count === 0)
    return {text: '✅ 기업 재무 상태 부실화 양호 ✅', color: 'text-green-600'}
  if (count === 1)
    return {text: '🔵 기업 재무 상태 부실화 관심 🔵', color: 'text-blue-600'}
  if (count >= 2 && count <= 3)
    return {text: '⚠️ 기업 재무 상태 부실화 주의 ⚠️', color: 'text-yellow-600'}
  if (count >= 4 && count <= 5)
    return {text: '‼️ 기업 재무 상태 부실화 경계 ‼️', color: 'text-orange-600'}
  return {text: '🚨 기업 재무 상태 부실화 심각 🚨', color: 'text-red-600'}
}

function PartnerCombobox({
  options,
  value,
  onChange
}: {
  options: string[]
  value: string | null
  onChange: (value: string) => void
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
          {value || '협력사 선택'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 mt-2">
        <Command>
          <CommandInput placeholder="협력사 검색..." />
          <CommandList>
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            <CommandGroup>
              {options.map(partner => (
                <CommandItem
                  key={partner}
                  value={partner}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === partner ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {partner}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function FinancialRiskForm() {
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)

  return (
    <div className="flex flex-col w-full h-full px-8 py-6 space-y-2 bg-[#F9FBFF]">
      <div className="flex flex-row px-2 mb-4 text-sm text-gray-700">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/partnerCompany">협력사 관리</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>재무제표 리스크 관리</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex justify-center w-full py-4 bg-white border rounded shadow-sm">
        <h2 className="text-2xl font-semibold">재무제표 리스크 관리</h2>
      </div>

      {selectedPartner && (
        <p
          className={`text-base font-bold text-center ${
            getStatusLabel(partnerQuestionMap[selectedPartner].length).color
          }`}>
          {selectedPartner}는 항목 총 {partnerQuestionMap[selectedPartner].length}개 :{' '}
          <b>{getStatusLabel(partnerQuestionMap[selectedPartner].length).text}</b>
        </p>
      )}

      <div className="flex flex-col space-y-1 w-[240px]">
        <Label htmlFor="partner" className="mb-1">
          협력사명
        </Label>
        <PartnerCombobox
          options={partners}
          value={selectedPartner}
          onChange={setSelectedPartner}
        />
      </div>

      {selectedPartner ? (
        <Card className="bg-white border rounded shadow">
          <CardContent className="p-4">
            <table className="w-full text-sm border-collapse table-fixed">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-3 text-sm font-medium text-gray-700 bg-gray-100 border">
                    항목
                  </th>
                  <th className="w-24 p-3 text-sm font-medium text-center text-gray-700 bg-gray-100 border whitespace-nowrap">
                    해당 여부
                  </th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3 text-left text-gray-800 align-top border">{`${
                      i + 1
                    }. ${q}`}</td>
                    <td className="w-24 p-3 text-center align-middle border">
                      {partnerQuestionMap[selectedPartner]?.includes(i) ? (
                        <Check className="w-5 h-5 mx-auto text-black-600" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-64 text-base text-gray-500 bg-white border rounded shadow">
          협력사를 선택해주세요.
        </div>
      )}

      {selectedPartner && (
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <DashButton width="w-40">재무제표 상세 확인</DashButton>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>재무제표 상세</DialogTitle>
              </DialogHeader>
              <iframe
                src="https://www.sfvc.co.kr/files/data/2022%EB%85%84%EC%9E%AC%EB%AC%B4%EC%83%81%ED%83%9C%ED%91%9C.pdf"
                className="w-full h-[80vh] rounded border"
                allowFullScreen
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}
