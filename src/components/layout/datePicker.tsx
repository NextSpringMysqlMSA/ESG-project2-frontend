'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {format} from 'date-fns'
import {ko} from 'date-fns/locale'
import {CalendarIcon} from 'lucide-react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'

import {cn} from '@/lib/utils'
import {toast} from '@/hooks/use-toast'
import {Button} from '@/components/ui/button'
import {Calendar} from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
const FormSchema = z.object({
  EoD: z.date({
    required_error: '날짜를 입력해 주세요.'
  }),
  EoP: z.coerce
    .number({required_error: '참여 인원은 음수가 될 수 없습니다.'})
    .or(z.literal(undefined))
    .refine(val => NaN, '인원수를 입력해주세요.')
})
export function DatePickerForm({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('제출완료')
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-items-center">
        <div className="flex ">
          <FormField
            control={form.control}
            name="EoD"
            render={({field}) => (
              <FormItem className="flex flex-col">
                <FormLabel>교육 날짜</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-4 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}>
                        {field.value ? (
                          format(field.value, 'PPP', {locale: ko}) // 한국어로 날짜 포맷팅
                        ) : (
                          <span>교육 날짜를 선택하세요.</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={date => date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>교육 날짜를 선택하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="EoP"
            render={({field}) => (
              <FormItem className="flex flex-col pl-8">
                <FormLabel>교육 인원</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    placeholder="1"
                    className="w-[240px] h-10 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={field.value ?? ''}
                    onChange={e => {
                      const val = e.target.value
                      field.onChange(val === '' ? undefined : Number(val))
                    }}
                  />
                </FormControl>
                <FormDescription>인원수를 입력하세요.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>{children}</div>
      </form>
    </Form>
  )
}
