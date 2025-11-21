/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
    Delete,
    Save,
    Update,
} from "@/actions/accounting/tax-action";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useAxiosInstance from "@/lib/axios-instance";
import { cn } from "@/lib/utils";
import { PageAction } from "@/utility/page-actions";
import { ReactQueryKey } from "@/utility/react-query-key";
import { z } from "zod";
import AppPageContainer from "@/components/AppPageContainerProps";
import React from "react";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import type { TaxType } from "@/actions/accounting/tax-action";
import type { IApiResponseType } from "@/actions/api-response-type";


const formSchema = z.object({
    Id: z.number(),
    IsActive: z.boolean(),
    Percentage: z.number(),
    Name: z.string().optional(),
});


type AccountTypeFormSchema = z.infer<typeof formSchema>;

export default function TaxForm({
    pageAction,
    isPopup,
}: {
    data: TaxType | undefined;
    pageAction: string;
    isPopup?: boolean;
}) {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [Errors, setErrors] = React.useState<string[] | null>([]);


    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();


    const mutation = useMutation({
        mutationFn: (tag: TaxType) => {
            if (pageAction === PageAction.add) {
                return Save(tag, axios);
            } else if (pageAction === PageAction.edit) {
                return Update(tag, axios);
            } else if (pageAction === PageAction.delete) {
                return Delete(tag.Id!, axios);
            } else {
                throw new Error("Page Action no found.");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKey.Taxs],
            });
            if (isPopup) {
                toast("Message", {
                    position: "top-center",
                    description: (
                        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                            <code className="text-white text-sm">
                                Tax added successfully.
                            </code>
                        </pre>
                    ),
                })
            } else {
                navigator("/configuration/tax");
            }
        },
        onError: (err: AxiosError) => {
            console.log('error', err.response?.data);
            const res = err.response?.data as IApiResponseType<TaxType>;
            if (res?.IsError) {
                setErrors(res?.Errors);
            }
        },
    });

    // 1. Define your form.
    const form = useForm<AccountTypeFormSchema>({
        resolver: zodResolver(formSchema),
    });

    const { control, handleSubmit } = form;


    // 2. Define a submit handler.
    function onSubmit(values: AccountTypeFormSchema) {
        setIsLoading(false);
        console.log(values);
        // mutation.mutate(values);
    }

    const onError = (errors: any) => {
        const extractMessages = (errObj: any, parentKey = ''): string[] => {
            if (!errObj || typeof errObj !== 'object') return [];

            return Object.entries(errObj).flatMap(([key, value]) => {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;

                if (
                    value &&
                    typeof value === 'object' &&
                    'message' in value &&
                    typeof (value as { message?: unknown }).message === 'string'
                ) {
                    return [`${fullKey}: ${(value as { message: string }).message}`];
                }

                // Array errors (like VoucherDetails[0])
                if (Array.isArray(value)) {
                    return value.flatMap((item, index) =>
                        extractMessages(item, `${fullKey}[${index}]`)
                    );
                }

                // Nested object errors
                if (typeof value === 'object') {
                    return extractMessages(value, fullKey);
                }

                return [];
            });
        };

        const messages = extractMessages(errors);
        toast("Form validation failed", {
            position: "top-center",
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                    <code className="text-white text-sm">
                        {messages.join("\n")}
                    </code>
                </pre>
            ),
        })
    };



    let errorMessage: string = "";
    if (mutation.isError) {
        errorMessage = mutation.error.message;
    }
    return (
        <AppPageContainer>
            <Alert
                variant="destructive"
                className={mutation.isError ? "visible" : "hidden"}
            >
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage + ". " + JSON.stringify(Errors)}</AlertDescription>

            </Alert>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <div className="min-w-full flex flex-col flex-wrap gap-2 justify-between">
                        <div className="w-full flex gap-5">
                            <div className={cn("w-full flex flex-col gap-3", (isPopup ? '' : 'sm:w-6/12'))}>
                                <FormField
                                    control={form.control}
                                    name="Id"
                                    render={({ field }) => (
                                        <FormItem className="hidden">
                                            <FormLabel>Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="GAUGE" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Tax Name */}
                                <FormField
                                    control={control}
                                    name="Name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Tax Percentage */}
                                <FormField
                                    control={control}
                                    name="Percentage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-black dark:text-white">Percentage</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field}
                                                    className="w-full border-[1.5px] border-gray-400 bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {/* Active */}
                                <FormField
                                    control={form.control}
                                    name="IsActive"
                                    render={({ field }) => {
                                        return (
                                            <FormItem className="flex flex-row items-center gap-2">
                                                <FormControl className="w-full">
                                                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                                        <Checkbox
                                                            defaultChecked
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            name={field.name}
                                                            ref={field.ref}
                                                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                                        />
                                                        <div className="grid gap-1.5 font-normal">
                                                            <p className="text-sm leading-none font-medium">
                                                                Is Active
                                                            </p>
                                                            <p className="text-muted-foreground text-sm">
                                                                This item will show other pages when it checked.
                                                            </p>
                                                        </div>
                                                    </Label>
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <Button
                                type="submit"
                                disabled={mutation.isPending ? true : isLoading}
                                className={cn(
                                    "w-24",
                                    pageAction === PageAction.view ? "hidden" : " "
                                )}
                                variant={
                                    pageAction === PageAction.delete ? "destructive" : "default"
                                }
                            >
                                {pageAction === PageAction.add
                                    ? "Save"
                                    : pageAction === PageAction.edit
                                        ? "Update"
                                        : "Delete"}
                            </Button>
                            <Button
                                type="reset"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    form.reset();
                                    form.clearErrors();
                                }}
                                variant={"outline"}
                                className={cn(
                                    "w-24",
                                    pageAction === PageAction.view ? "hidden" : "",
                                    pageAction === PageAction.delete ? "hidden" : ""
                                )}
                            >
                                Cancel
                            </Button>
                        </div>
                        <Button
                            type="reset"
                            disabled={mutation.isPending}
                            onClick={() =>
                                navigator("/configuration/tax")
                            }
                            variant={"outline"}
                            className={cn("w-24", isPopup ? 'hidden' : '')}
                        >
                            Back
                        </Button>
                    </div>
                </form>
            </Form>
        </AppPageContainer>
    );
}




{/*  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                                 Remove
                                                </Button> */}

{/* <Button type="button" onClick={() => append({
                                VouchersNo: "",
                                AccountId: 0,
                                AccountName: "",
                                DebitAmount: 0,
                                CreditAmount: 0,
                                IsDebitAccount: true,
                            })}>
                                Add Detail
                            </Button> */}