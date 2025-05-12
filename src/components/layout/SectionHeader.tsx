// 'use client'

// import {motion} from 'framer-motion'
// import {ReactNode} from 'react'
// import {Card, CardHeader} from '@/components/ui/card'
// import {Badge} from '@/components/ui/badge'

// type SectionHeaderProps = {
//   icon?: ReactNode
//   title: string
//   description?: string
//   badges?: Array<{
//     icon?: ReactNode
//     text: string
//     className?: string
//   }>
//   className?: string
//   children?: ReactNode
// }

// /**
//  * SectionHeader 컴포넌트
//  *
//  * 섹션 상단에 일관된 헤더 UI를 제공하는 컴포넌트입니다.
//  * 아이콘, 제목, 설명 및 뱃지를 포함할 수 있습니다.
//  */
// export function SectionHeader({
//   icon,
//   title,
//   description,
//   badges = [],
//   className = '',
//   children
// }: SectionHeaderProps) {
//   return (
//     <motion.div
//       initial={{opacity: 0, y: -10}}
//       animate={{opacity: 1, y: 0}}
//       transition={{duration: 0.3}}>
//       <Card className={`shadow-sm ${className}`}>
//         <CardHeader className="p-4 bg-white border-b">
//           <div className="flex flex-col justify-between md:flex-row md:items-center">
//             <div>
//               <div className="flex items-center mb-1">
//                 {icon && <div className="mr-2">{icon}</div>}
//                 <h3 className="text-lg font-semibold">{title}</h3>
//               </div>
//               {description && <p className="text-sm text-gray-500">{description}</p>}
//             </div>

//             {badges.length > 0 && (
//               <div className="flex gap-2 mt-2 md:mt-0">
//                 {badges.map((badge, index) => (
//                   <Badge
//                     key={index}
//                     variant="outline"
//                     className={
//                       badge.className || 'bg-blue-50 text-blue-600 border-blue-100 pl-1.5'
//                     }>
//                     {badge.icon && <span className="mr-1">{badge.icon}</span>}
//                     {badge.text}
//                   </Badge>
//                 ))}
//               </div>
//             )}

//             {children}
//           </div>
//         </CardHeader>
//       </Card>
//     </motion.div>
//   )
// }
