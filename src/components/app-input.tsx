/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
type props = {
    form: any,
    name: string,
    text?: string,
    placeholder?: string,
    className?: string,
    disabled?: boolean,
    type?: 'text' | 'number',
    inputTextAlign?: 'text-left' | 'text-center' | 'text-right',
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    align?: 'vertical' | 'horizontal',
    labelCSS?: string,
    isShowText?: boolean,
}
export default function AppInput(
    { form, name, text, placeholder, className, disabled = false, type = 'text', inputTextAlign, onBlur,
        isShowText = true, align = 'vertical', labelCSS = "w-16" }: props) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={cn("flex w-full",
                    align == "vertical" && "flex-col",
                    align == "horizontal" && "flex flex-col items-start justify-start sm:flex-row sm:items-center",
                    className,
                )}>
                    {(isShowText && text) && <FormLabel className={cn("block text-black dark:text-white",
                        align == "vertical" && "pb-2 text-nowrap",
                        align == "horizontal" && "text-left sm:text-right pr-2 pb-2 text-nowrap sm:pb-0",
                        labelCSS
                    )}>{text}</FormLabel>}

                    <div className='flex-1 w-full' style={{ margin: "0" }}>
                        <FormControl>
                            <Input
                                placeholder={placeholder ?? text}
                                type={type}
                                {...field}
                                disabled={disabled}
                                className={cn("w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                                    inputTextAlign && inputTextAlign,
                                    "text-sm h-8",
                                )}
                                onBlur={onBlur}
                            />
                        </FormControl>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
