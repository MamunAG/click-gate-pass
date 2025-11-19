/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

type props = {
    text: string,
    name: string,
    form: any,
    isShowText?: boolean,
    align?: 'vertical' | 'horizontal',
    labelCSS?: string,
}
export default function AppDate({ text, name, form, isShowText = true, align = 'vertical', labelCSS = "w-16" }: props) {
    const [open, setOpen] = React.useState(false);
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex w-full",
                    align == "vertical" && "flex-col",
                    align == "horizontal" && "flex flex-col items-start justify-start sm:flex-row sm:items-center",
                )}>
                    {(isShowText && text) && <FormLabel className={cn("block text-black dark:text-white",
                        align == "vertical" && "pb-2 text-nowrap",
                        align == "horizontal" && "text-left sm:text-right pr-2 pb-2 text-nowrap sm:pb-0",
                        labelCSS
                    )}>{text}</FormLabel>}
                    <div className='flex-1 w-full' style={{ margin: "0" }}>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal border-gray-400",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        size={"sm"}
                                    >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(e) => {
                                        field.onChange(e);
                                        setOpen(false)
                                    }}
                                    // disabled={(date) =>
                                    //     date > new Date() || date < new Date("1900-01-01")
                                    // }
                                    captionLayout="dropdown"
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
