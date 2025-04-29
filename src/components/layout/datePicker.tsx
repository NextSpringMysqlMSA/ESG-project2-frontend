'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {format} from 'date-fns'
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
  dob: z.date({
    required_error: '날짜를 입력해 주세요.'
  })
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="dob"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>교육 날짜</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}>
                      {field.value ? (
                        format(field.value, 'PPP')
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
                    disabled={date => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {children}
      </form>
    </Form>
  )
}
