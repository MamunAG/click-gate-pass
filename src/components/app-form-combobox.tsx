/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { SelectItemType } from '@/types/selectItemType';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import React, { startTransition } from 'react';

type props = {
    form: any,
    text?: string,
    textFieldName: string,
    valueFieldName: string,
    selectItems?: SelectItemType[],
    selectItemsValueFieldName?: string,
    selectItemsLabelFieldName?: string
    onSelectCommandItem?: () => void,
    onClickXButton?: () => void,
    isShowText?: boolean,
    align?: 'vertical' | 'horizontal',
    labelCSS?: string,
    onScrollFun?: (search: string, currentPage: number) => Promise<any>
}

export default function AppFormCombobox(
    { text, isShowText = true, textFieldName, valueFieldName,
        form, selectItems, onSelectCommandItem, onClickXButton,
        align = 'vertical', labelCSS = "w-16", onScrollFun,
        selectItemsValueFieldName = 'value',
        selectItemsLabelFieldName = 'label', }: props) {
    const [openPaymentMethod, setOpenPaymentMethod] = React.useState(false)
    const [paymentMethods, setPaymentMethods] = React.useState<SelectItemType[]>([])
    const [page, setPage] = React.useState(1);
    const [isLoadingRef, setIsLoadingRef] = React.useState(false);
    const scrollTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [search, setSearch] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(false);

    React.useEffect(() => {
        if (selectItems) {
            setPaymentMethods(selectItems);
        }
    }, [selectItems])

    function getData() {
        if (onScrollFun && !isLoadingRef) {
            setIsLoadingRef(true);
            onScrollFun(search, page).then(res => {
                const da = res?.map((_: any) => ({ label: _[selectItemsLabelFieldName]?.toString(), value: _[selectItemsValueFieldName]?.toString() })) ?? []
                if (page == 1) {
                    setPaymentMethods(da);
                } else {
                    setPaymentMethods(prev => {
                        const merged = [...prev, ...da];
                        const unique = [...new Set(merged)];
                        return unique;
                    });
                }
                setIsLoadingRef(false);
                console.log('da',)
            }).catch(() => {
                setIsLoadingRef(false);
            });
        }
        else console.log('unde')
    }
    console.log('paymentMethods', paymentMethods)

    React.useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    React.useEffect(() => {
        if (!onScrollFun) {
            return;
        }
        if (!search) {
            startTransition(() => {
                setIsSearching(false);
            });
            return;
        }

        startTransition(() => {
            setIsSearching(true);
        });
        const timer = setTimeout(() => {
            // Simulate API call
            startTransition(() => {
                getData();
                setIsSearching(false);
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);


    const handleScroll = (e: any) => {
        if (onScrollFun) {
            const { scrollTop, scrollHeight, clientHeight } = e.target;

            // Reached bottom
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                // Debounce rapid scroll events
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
                scrollTimeoutRef.current = setTimeout(() => {
                    setPage((prev) => prev + 1);
                    scrollTimeoutRef.current = null;
                }, 150);
            }
        }
    };
    // console.log('prev', page)

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
                                                ? paymentMethods?.find(
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
                                        onValueChange={setSearch}
                                        value={search}
                                        placeholder={`Search ${text?.toLowerCase()}...`}
                                        className="h-9"
                                    />
                                    <CommandList onScroll={(e) => {
                                        handleScroll(e)
                                    }}>
                                        {isSearching ? (
                                            <div className="flex items-center justify-center p-4">
                                                <Loader2 className="size-4 animate-spin" />
                                                <span className="text-muted-foreground ml-2 text-sm">
                                                    Searching...
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <CommandEmpty>No {text?.toLowerCase()} found.</CommandEmpty>
                                                <CommandGroup>
                                                    {paymentMethods?.map((language) => (
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
                                            </>
                                        )}
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
