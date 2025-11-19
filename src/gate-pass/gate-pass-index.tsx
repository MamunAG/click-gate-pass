import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import React from 'react'
import { GatePassTable } from './gate-pass-table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BreadcrumbDemo } from '@/components/app-breadcrumb'
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const formSchema = z.object({
    // CountryId: z.number(),
    Name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    // Phonecode: z.string().optional(),
    // IsoCode2: z.string().optional(),
    // IsoCode3: z.string().optional(),
    // Region: z.string().optional(),
    // Status: z.boolean().default(true),
    // Createby: z.string().optional(),
    // Createdate: z.date().optional(),
});

export default function GatePassIndex() {
    const [dtFromopen, setdtFromOpen] = React.useState(false)
    const [dtFromdate, setdtFromDate] = React.useState<Date | undefined>(undefined)


    const [dtToopen, setdtToOpen] = React.useState(false)
    const [dtTodate, setdtToDate] = React.useState<Date | undefined>(undefined)


    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // const data: CountryType = {
        //     CountryId: values?.CountryId,
        //     Name: values?.Name,
        //     Phonecode: values?.Phonecode,
        //     IsoCode2: values?.IsoCode2,
        //     IsoCode3: values?.IsoCode3,
        //     Region: values?.Region,
        //     Status: values?.Status,
        //     Createby: values?.Createby,
        //     Createdate: values?.Createdate
        //         ? moment(values?.Createdate).format("YYYY-MM-DD")
        //         : moment(new Date()).format("YYYY-MM-DD"),
        // };
        console.log(values);
        // mutation.mutate(data);
        alert(JSON.stringify(values));
    }

    return (
        <div>
            <div>
                <BreadcrumbDemo />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="Name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>

            <div className='flex flex-wrap gap-3'>

                <div className="flex gap-3">
                    <Label htmlFor="date" className="px-1">
                        From Date
                    </Label>
                    <Popover open={dtFromopen} onOpenChange={setdtFromOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {dtFromdate ? dtFromdate.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dtFromdate}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setdtFromDate(date)
                                    setdtFromOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex gap-3">
                    <Label htmlFor="date" className="px-1">
                        To Date
                    </Label>
                    <Popover open={dtToopen} onOpenChange={setdtToOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="date"
                                className="w-48 justify-between font-normal"
                            >
                                {dtTodate ? dtTodate.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dtTodate}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setdtToDate(date)
                                    setdtToOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className='flex gap-1'>
                    <Label htmlFor="date" className="px-1 text-nowrap">Created By</Label>
                    <Input placeholder='Search' />
                </div>
                <div className='flex gap-1'>
                    <Label htmlFor="date" className="px-1 text-nowrap">Company</Label>
                    <Select>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3">Demo</SelectItem>
                            <SelectItem value="1">ICCL</SelectItem>
                            <SelectItem value="2">Megnam</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                <Button className='hover:cursor-pointer'>Search</Button>

            </div>

            <div className='mt-5'>
                <GatePassTable />
            </div>
        </div>
    )
}
