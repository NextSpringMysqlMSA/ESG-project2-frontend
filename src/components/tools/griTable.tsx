'use client'

import {useState} from 'react'
import TextModal from '@/app/(dashboard)/GRI/(tables)/textModal'
import {cn} from '@/lib/utils'
import {Edit2, CheckCircle2} from 'lucide-react'

// 테이블 셀 타입 정의
type TableCell = string | {value: string; rowSpan?: number}

// TableProps 타입 정의
type TableProps = {
  headers: string[]
  rows: TableCell[][]
  tableId: string
}

const getCellValue = (cell: TableCell) => (typeof cell === 'string' ? cell : cell.value)

// 간단한 커스텀 툴팁 컴포넌트
const SimpleTooltip = ({
  children,
  content
}: {
  children: React.ReactNode
  content: string
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute z-50 px-2 py-1 mb-2 text-xs text-white transition-opacity duration-200 -translate-x-1/2 rounded-md opacity-0 pointer-events-none bottom-full left-1/2 bg-customGDark group-hover:opacity-100 whitespace-nowrap">
        {content}
        <div className="absolute -translate-x-1/2 border-4 border-transparent top-full left-1/2 border-t-customGDark"></div>
      </div>
    </div>
  )
}

export default function GriTable({headers, rows, tableId}: TableProps) {
  // 모달 관련 상태 변수들
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKey, setModalKey] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalContents, setModalContents] = useState<Record<string, string>>({})
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // 모달 열기 함수
  const openModal = (key: string, title: string, content: string) => {
    setModalKey(key)
    setModalTitle(title)
    setModalContent(content)
    setModalOpen(true)
  }

  // 모달 닫기 함수
  const closeModal = () => {
    if (modalKey) {
      setModalContents(prev => ({
        ...prev,
        [modalKey]: modalContent
      }))
    }
    setModalOpen(false)
    setModalKey('')
    setModalTitle('')
    setModalContent('')
  }

  // 행 디자인 설정 함수 - 테마색 적용
  const getRowStyle = (index: number) => {
    return cn(
      'transition-colors duration-200',
      index % 2 === 0 ? 'bg-white' : 'bg-customGLight/20',
      hoveredRow === index && 'bg-customGLight/40'
    )
  }

  // 셀 내용의 상태 확인 (빈 값인지 확인)
  const hasCellContent = (key: string) => {
    return modalContents[key] && modalContents[key].trim() !== ''
  }

  return (
    <div className="relative overflow-x-auto rounded-lg">
      <TextModal
        open={modalOpen}
        title={modalTitle}
        value={modalContent}
        onChange={val => setModalContent(val)}
        onClose={closeModal}
      />

      <div className="overflow-hidden border-0 rounded-lg shadow-sm">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="text-sm font-medium text-customGTextDark bg-customGLight">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 text-left',
                    index !== headers.length - 1
                      ? 'border-r border-customGBorder/30'
                      : '',
                    index === 0 && 'rounded-tl-lg',
                    index === headers.length - 1 && 'rounded-tr-lg'
                  )}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-customGBorder/30">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={getRowStyle(i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}>
                {row.map((cell, j) => {
                  const content = typeof cell === 'string' ? {value: cell} : cell
                  const isLastCol = j === row.length - 1
                  const cellValue = content.value

                  // No. 또는 Topic 컬럼에 대한 값 추출 - getCellValue 함수 적용
                  const noValue = row.length > 0 ? getCellValue(row[0]) : ''
                  const title = row.length > 1 ? getCellValue(row[1]) : '세부 내용'

                  // 모달을 구분할 key 생성
                  const modalKey = `${tableId}:${noValue}`

                  // 마지막 열이 비어 있는지 확인 (편집 가능한 내용)
                  const isEmpty =
                    isLastCol &&
                    (!modalContents[modalKey] || modalContents[modalKey].trim() === '')

                  // 내용이 있는 경우 짧게 표시
                  const shortContent =
                    isLastCol && modalContents[modalKey]
                      ? modalContents[modalKey].length > 50
                        ? modalContents[modalKey].substring(0, 50) + '...'
                        : modalContents[modalKey]
                      : cellValue

                  return (
                    <td
                      key={j}
                      rowSpan={content.rowSpan}
                      className={cn(
                        'px-4 py-2.5 text-sm',
                        j !== row.length - 1 ? 'border-r border-customGBorder/20' : '',
                        isLastCol
                          ? 'w-full min-w-[300px] cursor-pointer group relative'
                          : j === 0
                          ? 'font-medium text-customGTextDark whitespace-nowrap'
                          : 'text-gray-700 whitespace-nowrap'
                      )}
                      onClick={() => {
                        if (isLastCol)
                          openModal(modalKey, title, modalContents[modalKey] || cellValue)
                      }}>
                      {isLastCol ? (
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              'transition-colors duration-200',
                              isEmpty ? 'text-gray-400 italic' : 'text-customGTextDark'
                            )}>
                            {isEmpty ? '내용을 입력하려면 클릭하세요' : shortContent}
                          </span>
                          <div className="flex items-center space-x-2">
                            {hasCellContent(modalKey) && (
                              <SimpleTooltip content="내용이 작성되었습니다">
                                <CheckCircle2 className="w-4 h-4 text-customG" />
                              </SimpleTooltip>
                            )}
                            <span className="transition-all opacity-0 group-hover:opacity-100">
                              <SimpleTooltip content="내용 편집하기">
                                <Edit2 className="w-4 h-4 text-customG hover:text-customGDark" />
                              </SimpleTooltip>
                            </span>
                          </div>
                        </div>
                      ) : (
                        cellValue
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-8 text-center bg-customGLight/10 text-customGTextDark">
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
