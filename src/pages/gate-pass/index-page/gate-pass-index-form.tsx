import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";


const formSchema = z.object({
  createdBy: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export type formIndexType = z.infer<typeof formSchema>;

export default function GatePassIndexForm({ handleIndexFormSubmit }: { handleIndexFormSubmit: (values: formIndexType) => void }) {
  const [dtFromopen, setdtFromOpen] = React.useState(false)
  const [dtFromdate, setdtFromDate] = React.useState<Date | undefined>(undefined)

  const [dtToOpen, setdtToOpen] = React.useState(false)
  const [dtToDate, setdtToDate] = React.useState<Date | undefined>(undefined)

  // 1. Define your form.
  const form = useForm<formIndexType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      createdBy: ''
    }

  });

  function onSubmit(values: formIndexType) {
    console.log(values);
    handleIndexFormSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-2">
          <div>
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem className="w-full flex">
                  <FormLabel className="text-nowrap">From Date</FormLabel>
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
                          field.onChange(date);
                          setdtFromDate(date);
                          setdtFromOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem className="w-full flex">
                  <FormLabel>To Date</FormLabel>
                  <Popover open={dtToOpen} onOpenChange={setdtToOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        {dtToDate ? dtToDate.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dtToDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          field.onChange(date);
                          setdtToDate(date);
                          setdtToOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormLabel className="text-nowrap">Created By</FormLabel>
                  <FormControl className="w-40">
                    <Input placeholder="created by" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="cursor-pointer">Search</Button>
        </div>

      </form>
    </Form>
  )
}
