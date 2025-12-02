/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput,
    CommandItem, CommandList
} from '@/components/ui/command';
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { SelectItemType } from '@/types/selectItemType';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useState, useCallback, useMemo, useRef, startTransition, useEffect } from 'react';

type Props = {
    form: any;
    text?: string;
    textFieldName: string;
    valueFieldName: string;

    selectItems?: SelectItemType[];
    selectItemsValueFieldName?: string;
    selectItemsLabelFieldName?: string;

    onSelectCommandItem?: () => void;
    onClickXButton?: () => void;

    isShowText?: boolean;
    align?: 'vertical' | 'horizontal';
    labelCSS?: string;

    onScrollFun?: (search: string, currentPage: number) => Promise<any>;
};

export default function AppFormComboboxCopy({
    text,
    isShowText = true,
    textFieldName,
    valueFieldName,
    form,
    selectItems,
    onSelectCommandItem,
    onClickXButton,
    align = 'vertical',
    labelCSS = "w-16",
    onScrollFun,
    selectItemsValueFieldName = 'value',
    selectItemsLabelFieldName = 'label',
}: Props) {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<SelectItemType[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const loadingRef = useRef(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load initial items
    useEffect(() => {
        if (selectItems) setOptions(selectItems);
    }, [selectItems]);

    // ──────────────────────────────────────────────
    // 📌 Optimized: fetchData using useCallback
    // ──────────────────────────────────────────────
    const fetchData = useCallback(() => {
        if (!onScrollFun || loadingRef.current) return;

        loadingRef.current = true;

        onScrollFun(search, page)
            .then((res) => {
                const mapped = res?.map((_: any) => ({
                    label: _[selectItemsLabelFieldName]?.toString(),
                    value: _[selectItemsValueFieldName]?.toString(),
                })) ?? [];

                setOptions(prev => {
                    if (page === 1) return mapped;

                    // Unique merge
                    const unique = new Map();
                    [...prev, ...mapped].forEach(item => unique.set(item.value, item));
                    return Array.from(unique.values());
                });
            })
            .finally(() => {
                loadingRef.current = false;
            });
    }, [onScrollFun, page, search, selectItemsLabelFieldName, selectItemsValueFieldName]);

    // ──────────────────────────────────────────────
    // 📌 Fetch when page changes
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (onScrollFun) fetchData();
    }, [page, fetchData]);

    // ──────────────────────────────────────────────
    // 📌 Search Debouncing (optimized)
    // ──────────────────────────────────────────────
    useEffect(() => {
        if (!onScrollFun) return;

        setPage(1);

        if (!search) {
            startTransition(() => setIsSearching(false));
            fetchData();
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(() => {
            fetchData();
            setIsSearching(false);
        }, 400); // Slightly faster debounce

        return () => clearTimeout(timer);
    }, [search, onScrollFun, fetchData]);

    // ──────────────────────────────────────────────
    // 📌 Optimized scroll handling with useCallback
    // ──────────────────────────────────────────────
    const handleScroll = useCallback((e: any) => {
        if (!onScrollFun) return;

        const { scrollTop, scrollHeight, clientHeight } = e.target;

        if (scrollTop + clientHeight >= scrollHeight - 5) {
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

            scrollTimeoutRef.current = setTimeout(() => {
                setPage(prev => prev + 1);
                scrollTimeoutRef.current = null;
            }, 120);
        }
    }, [onScrollFun]);

    // ──────────────────────────────────────────────
    // 📌 Memoized selected label
    // ──────────────────────────────────────────────
    const selectedLabel = useMemo(() => {
        return options.find(x => x.value === form.getValues(valueFieldName)?.toString())?.label;
    }, [options, form, valueFieldName]);

    // ──────────────────────────────────────────────
    // ✔️ Component UI (unchanged)
    // ──────────────────────────────────────────────
    return (
        <FormField
            control={form.control}
            name={valueFieldName}
            render={({ field }) => (
                <FormItem
                    className={cn(
                        "flex w-full text-nowrap",
                        align === "vertical" && "flex-col",
                        align === "horizontal" && "flex flex-col items-start justify-start sm:flex-row sm:items-center",
                    )}
                >
                    {(isShowText && text) && (
                        <FormLabel
                            className={cn(
                                "block text-black dark:text-white",
                                align === "vertical" && "pb-2",
                                align === "horizontal" && "text-left sm:text-right pr-2 pb-2 sm:pb-0",
                                labelCSS
                            )}
                        >
                            {text}
                        </FormLabel>
                    )}

                    <div className="flex-1 w-full">
                        <Popover open={open} onOpenChange={setOpen}>
                            <div className="relative">
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn("w-full justify-between border-gray-400", !field.value && "text-muted-foreground")}
                                            size="sm"
                                        >
                                            {selectedLabel || `Select ${text?.toLowerCase()}`}
                                            {!form.getValues(textFieldName) && <ChevronsUpDown className="opacity-50" />}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>

                                {/* Clear button */}
                                {form.getValues(textFieldName) && (
                                    <X
                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-4 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                                        onClick={() => {
                                            form.setValue(valueFieldName, 0);
                                            form.setValue(textFieldName, "");
                                            onClickXButton?.();
                                        }}
                                    />
                                )}
                            </div>

                            <PopoverContent className="w-auto p-0 bg-white text-black border-gray-400" align="start">
                                <Command>
                                    <CommandInput
                                        onValueChange={setSearch}
                                        value={search}
                                        placeholder={`Search ${text?.toLowerCase()}...`}
                                        className="h-9"
                                    />

                                    <CommandList onScroll={handleScroll}>
                                        {isSearching ? (
                                            <div className="flex items-center justify-center p-4">
                                                <Loader2 className="size-4 animate-spin" />
                                                <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <CommandEmpty>No {text?.toLowerCase()} found.</CommandEmpty>
                                                <CommandGroup>
                                                    {options.map((opt) => (
                                                        <CommandItem
                                                            value={opt.label}
                                                            key={opt.value}
                                                            onSelect={() => {
                                                                form.setValue(valueFieldName, Number(opt.value));
                                                                form.setValue(textFieldName, opt.label);
                                                                setOpen(false);
                                                                onSelectCommandItem?.();
                                                            }}
                                                        >
                                                            {opt.label}
                                                            <Check
                                                                className={cn("ml-auto", opt.value === field.value?.toString() ? "opacity-100" : "opacity-0")}
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
    );
}
