/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import type { SelectItemType } from '@/types/selectItemType';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
type props = {
    form: any,
    text: string,
    textFieldName: string,
    valueFieldName: string,
    selectItems?: any[],
    onSelectCommandItem?: () => void,
    onClickXButton?: () => void,
    isShowText?: boolean,
    align?: 'vertical' | 'horizontal',
    labelCSS?: string,
    selectItemsValueFieldName?: string,
    selectItemsLabelFieldName?: string

}

export default function AppAutoItemAddCombobox({
    text,
    isShowText = true,
    textFieldName,
    valueFieldName,
    form,
    selectItems,
    selectItemsValueFieldName = 'value',
    selectItemsLabelFieldName = 'label',
    onSelectCommandItem,
    onClickXButton,
    align = 'vertical',
    labelCSS = "w-16" }: props) {

    const [openParty, setOpenParty] = React.useState(false)
    const [Parties, setParties] = React.useState<SelectItemType[]>([])
    React.useEffect(() => {
        const seItems = selectItems?.map((item: any) => {
            return { label: item[selectItemsLabelFieldName], value: item[selectItemsValueFieldName].toString() }
        })
        setParties(seItems ?? []);
    }, [selectItems])

    return (
        <FormField
            control={form.control}
            name={valueFieldName}
            render={({ field }) => (
                <FormItem className={cn("flex w-full text-nowrap",
                    align == "vertical" && "flex-col",
                    align == "horizontal" && "flex flex-col items-start justify-start sm:flex-row sm:items-center",
                )}>
                    {(isShowText && text) && <FormLabel className={cn("block text-black dark:text-white",
                        align == "vertical" && "pb-2",
                        align == "horizontal" && "text-left sm:text-right pr-2 pb-2 sm:pb-0",
                        labelCSS
                    )}>{text}</FormLabel>}
                    <div className='flex-1 w-full' style={{ margin: "0" }}>
                        <Popover open={openParty} onOpenChange={setOpenParty}>
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
                                            {field.value !== undefined && field.value !== null
                                                ? (Parties.find(
                                                    (language) => language.value === field.value?.toString()
                                                )?.label ?? (`Select ${text?.toLowerCase()}`))
                                                : (`Select ${text?.toLowerCase()}`)}

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
                            <PopoverContent className="w-auto p-0 bg-white text-black  border-gray-400" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder={`Search ${text?.toLowerCase()}...`}
                                        className="h-9"
                                        onValueChange={(value) => {
                                            form.setValue(valueFieldName, 0);
                                            form.setValue(textFieldName, value);
                                        }}
                                        onBlur={(e) => {
                                            const trimmedInput = (e.target as HTMLInputElement).value.trim();
                                            if (!trimmedInput) return;

                                            // Check if label already exists (case-insensitive match)
                                            const existingParty = Parties.find(
                                                (p) => p.label.toLowerCase() === trimmedInput.toLowerCase()
                                            );

                                            if (existingParty) {
                                                form.setValue(valueFieldName, Number(existingParty.value));
                                                form.setValue(textFieldName, existingParty.label);
                                                return;
                                            }

                                            // setInputValue(trimmedInput);
                                            const tempId = "0";
                                            form.setValue(valueFieldName, Number(tempId));
                                            form.setValue(textFieldName, trimmedInput);

                                            setParties((prev) => {
                                                const existingIndex = prev.findIndex((p) => p.value === tempId);
                                                if (existingIndex !== -1) {
                                                    const updated = [...prev];
                                                    updated[existingIndex] = { ...updated[existingIndex], label: trimmedInput };
                                                    return updated;
                                                }
                                                return [...prev, { label: trimmedInput, value: tempId }];
                                            });
                                        }}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No ${text?.toLowerCase()} found.</CommandEmpty>
                                        <CommandGroup>
                                            {Parties.map((language) => (
                                                <CommandItem
                                                    value={language.label}
                                                    key={language.value}
                                                    onSelect={() => {
                                                        form.setValue(valueFieldName, Number(language.value));
                                                        form.setValue(textFieldName, language.label);
                                                        setOpenParty(false);
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
