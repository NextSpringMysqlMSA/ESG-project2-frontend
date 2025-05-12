'use client'

import {ReactNode} from 'react'
import {motion} from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card'
import {cn} from '@/lib/utils'

type ModuleFormCardProps = {
  title: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  actions?: ReactNode
  module: 'GRI' | 'CSDD' | 'IFRS'
  submodule?: 'governance' | 'strategy' | 'goal'
}

/**
 * GRI 모듈용 폼 카드 컴포넌트 - 현재 직접 사용되지 않음
 */
// export function GRIFormCard({
//   title,
//   description,
//   icon,
//   children,
//   className,
//   contentClassName,
//   actions
// }: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
//   return (
//     <motion.div
//       initial={{opacity: 0, y: 10}}
//       animate={{opacity: 1, y: 0}}
//       transition={{duration: 0.3}}>
//       <Card className={cn('shadow-sm border-customG/10', className)}>
//         <CardHeader className="p-4 bg-white border-b border-customG/10">
//           <div className="flex items-center gap-2">
//             {icon && <div className="text-customG">{icon}</div>}
//             <div>
//               <CardTitle className="text-gray-800">{title}</CardTitle>
//               {description && (
//                 <CardDescription className="text-gray-500">{description}</CardDescription>
//               )}
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>

//         {actions && (
//           <CardFooter className="flex justify-end p-4 pt-2 border-t">
//             {actions}
//           </CardFooter>
//         )}
//       </Card>
//     </motion.div>
//   )
// }

/**
 * CSDD 모듈용 폼 카드 컴포넌트 - 현재 직접 사용되지 않음
 */
// export function CSDDFormCard({
//   title,
//   description,
//   icon,
//   children,
//   className,
//   contentClassName,
//   actions
// }: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
//   return (
//     <motion.div
//       initial={{opacity: 0, y: 10}}
//       animate={{opacity: 1, y: 0}}
//       transition={{duration: 0.3}}>
//       <Card className={cn('shadow-sm border-customG/10', className)}>
//         <CardHeader className="p-4 bg-white border-b border-customG/10">
//           <div className="flex items-center gap-2">
//             {icon && <div className="text-customG">{icon}</div>}
//             <div>
//               <CardTitle className="text-gray-800">{title}</CardTitle>
//               {description && (
//                 <CardDescription className="text-gray-500">{description}</CardDescription>
//               )}
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>

//         {actions && (
//           <CardFooter className="flex justify-end p-4 pt-2 border-t">
//             {actions}
//           </CardFooter>
//         )}
//       </Card>
//     </motion.div>
//   )
// }

/**
 * IFRS 거버넌스 모듈용 폼 카드 컴포넌트 - 현재 사용됨 (committee.tsx에서 사용 중)
 */
export function IFRSGovernanceFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-blue-500/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-blue-500/10">
          <div className="flex items-center gap-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <div>
              <CardTitle className="text-gray-800">{title}</CardTitle>
              {description && (
                <CardDescription className="text-gray-500">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>

        {actions && (
          <CardFooter className="flex justify-end p-4 pt-2 border-t">
            {actions}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

/**
 * IFRS 전략 모듈용 폼 카드 컴포넌트 - 현재 직접 사용되지 않음
 */
// export function IFRSStrategyFormCard({
//   title,
//   description,
//   icon,
//   children,
//   className,
//   contentClassName,
//   actions
// }: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
//   return (
//     <motion.div
//       initial={{opacity: 0, y: 10}}
//       animate={{opacity: 1, y: 0}}
//       transition={{duration: 0.3}}>
//       <Card className={cn('shadow-sm border-purple-500/10', className)}>
//         <CardHeader className="p-4 bg-white border-b border-purple-500/10">
//           <div className="flex items-center gap-2">
//             {icon && <div className="text-purple-600">{icon}</div>}
//             <div>
//               <CardTitle className="text-gray-800">{title}</CardTitle>
//               {description && (
//                 <CardDescription className="text-gray-500">{description}</CardDescription>
//               )}
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>

//         {actions && (
//           <CardFooter className="flex justify-end p-4 pt-2 border-t">
//             {actions}
//           </CardFooter>
//         )}
//       </Card>
//     </motion.div>
//   )
// }

/**
 * IFRS 목표/지표 모듈용 폼 카드 컴포넌트 - 현재 사용됨 (kpiGoal.tsx에서 사용 중)
 */
export function IFRSGoalFormCard({
  title,
  description,
  icon,
  children,
  className,
  contentClassName,
  actions
}: Omit<ModuleFormCardProps, 'module' | 'submodule'>) {
  return (
    <motion.div
      initial={{opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}>
      <Card className={cn('shadow-sm border-emerald-500/10', className)}>
        <CardHeader className="p-4 bg-white border-b border-emerald-500/10">
          <div className="flex items-center gap-2">
            {icon && <div className="text-emerald-600">{icon}</div>}
            <div>
              <CardTitle className="text-gray-800">{title}</CardTitle>
              {description && (
                <CardDescription className="text-gray-500">{description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn('p-5', contentClassName)}>{children}</CardContent>

        {actions && (
          <CardFooter className="flex justify-end p-4 pt-2 border-t">
            {actions}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
