/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type props = {
    text: string
    data: { value: string, label: string }[]
    onSetValue: React.Dispatch<React.SetStateAction<string>>,
    isLoading?: boolean
}
export function AppCombobox({ text, data, onSetValue, isLoading }: props) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    React.useEffect(() => {
        if (value) {
            onSetValue(value)
        }
    }, [value])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={isLoading}
                >
                    {value
                        ? data.find((framework) => framework.value === value)?.label
                        : `Select ${text.toLowerCase()}...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-full p-0 bg-white text-black z-99999">
                <Command>
                    <CommandInput placeholder={`Search ${text.toLowerCase()}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No {text.toLowerCase()} found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {framework.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
