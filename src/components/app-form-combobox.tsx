/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { SelectItemType } from '@/types/selectItemType';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import React from 'react';

type props = {
    form: any,
    text: string,
    textFieldName: string,
    valueFieldName: string,
    selectItems: SelectItemType[],
    onSelectCommandItem?: () => void,
    onClickXButton?: () => void,
    isShowText?: boolean,
    align?: 'vertical' | 'horizontal',
    labelCSS?: string,
}

export default function AppFormCombobox(
    { text, isShowText = true, textFieldName, valueFieldName, form, selectItems, onSelectCommandItem, onClickXButton,
        align = 'vertical', labelCSS = "w-16" }: props) {

    const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false)
    const [paymentMethods, setPaymentMethods] = React.useState<SelectItemType[]>([])
    React.useEffect(() => {
        setPaymentMethods(selectItems);
    }, [selectItems])

    return (
        <FormField
            control={form.control}
            name={valueFieldName}
            render={({ field }) => (
                <FormItem className={cn("flex w-full text-nowrap",
                    align == "vertical" && "flex-col",
                    align == "horizontal" && "flex flex-col items-start justify-start sm:flex-row sm:items-center",
                    // "border"
                )}>
                    {(isShowText && text) && <FormLabel className={cn("block text-black dark:text-white",
                        align == "vertical" && "pb-2",
                        align == "horizontal" && "text-left sm:text-right pr-2 pb-2 sm:pb-0",
                        labelCSS
                    )}>{text}</FormLabel>}
                    <div className='flex-1 w-full' style={{ margin: "0" }}>
                        <Popover open={openPaymentMethod} onOpenChange={setOpenPaymentMethod}>
                            <div className="relative">
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-full justify-between border-gray-400",
                                                !field.value && "text-muted-foreground",
                                                "mr-6"
                                            )}
                                            size={"sm"}
                                        >
                                            {field.value
                                                ? paymentMethods.find(
                                                    (language) => language.value === field.value?.toString()
                                                )?.label
                                                : `Select ${text?.toLowerCase()}`}

                                            {form.getValues(textFieldName) ? '' : <ChevronsUpDown className="opacity-50" />}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                {form.getValues(textFieldName) ? (
                                    <X
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-4 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                                        onClick={() => {
                                            form.setValue(valueFieldName, 0);
                                            form.setValue(textFieldName, "");
                                            onClickXButton?.();
                                        }}
                                    />
                                ) : ''}
                            </div>
                            <PopoverContent className="w-auto p-0 bg-white text-black border-gray-400 z-999" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder={`Search ${text?.toLowerCase()}...`}
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>No ${text?.toLowerCase()} found.</CommandEmpty>
                                        <CommandGroup>
                                            {paymentMethods.map((language) => (
                                                <CommandItem
                                                    value={language.label}
                                                    key={language.value}
                                                    onSelect={() => {
                                                        form.setValue(valueFieldName, Number(language.value))
                                                        form.setValue(textFieldName, language.label)
                                                        setOpenPaymentMethod(false)

                                                        onSelectCommandItem?.();
                                                    }}
                                                >
                                                    {language.label}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            language.value === field.value?.toString()
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    )
}
