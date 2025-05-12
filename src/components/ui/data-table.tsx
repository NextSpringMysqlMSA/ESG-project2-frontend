// 'use client'

// import {useState, ReactNode} from 'react'
// import {motion} from 'framer-motion'
// import {Card, CardContent} from '@/components/ui/card'
// import {cn} from '@/lib/utils'

// type DataTableProps = {
//   headers: string[]
//   data: Array<Array<string | ReactNode>>
//   className?: string
//   onRowClick?: (rowIndex: number) => void
//   emptyMessage?: string
//   striped?: boolean
//   compact?: boolean
//   hoverable?: boolean
// }

// /**
//  * DataTable 컴포넌트
//  *
//  * 데이터를 테이블 형식으로 표시하는 공통 컴포넌트입니다.
//  * 헤더와 데이터를 받아 일관된 스타일의 테이블을 생성합니다.
//  */
// export function DataTable({
//   headers,
//   data,
//   className = '',
//   onRowClick,
//   emptyMessage = '표시할 데이터가 없습니다.',
//   striped = true,
//   compact = false,
//   hoverable = true
// }: DataTableProps) {
//   const [hoveredRow, setHoveredRow] = useState<number | null>(null)

//   const cellPadding = compact ? 'px-4 py-2' : 'px-6 py-3'

//   return (
//     <motion.div
//       initial={{opacity: 0, y: 10}}
//       animate={{opacity: 1, y: 0}}
//       transition={{duration: 0.3}}
//       className={className}>
//       <Card className="overflow-hidden shadow-sm">
//         <CardContent className="p-0">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//                 <tr>
//                   {headers.map((header, index) => (
//                     <th
//                       key={index}
//                       className={cn(cellPadding, 'font-medium border-b border-gray-200')}>
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((row, rowIndex) => (
//                     <tr
//                       key={rowIndex}
//                       className={cn(
//                         hoverable && 'transition-colors hover:bg-gray-50',
//                         striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
//                         onRowClick && 'cursor-pointer',
//                         hoveredRow === rowIndex && 'bg-gray-100'
//                       )}
//                       onClick={() => onRowClick?.(rowIndex)}
//                       onMouseEnter={() => setHoveredRow(rowIndex)}
//                       onMouseLeave={() => setHoveredRow(null)}>
//                       {row.map((cell, cellIndex) => (
//                         <td
//                           key={cellIndex}
//                           className={cn(cellPadding, 'border-b border-gray-100')}>
//                           {cell}
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={headers.length}
//                       className="px-6 py-8 text-center text-gray-500">
//                       {emptyMessage}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   )
// }
