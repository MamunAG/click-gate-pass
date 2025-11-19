/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
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
import { z } from "zod";
import AppPageContainer from "@/components/AppPageContainerProps";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { GetAllActivesupplier } from "@/actions/configuration/supplier-action";
import type { IApiResponseType } from "@/actions/api-response-type";
import AppInput from "@/components/app-input";
import AppAutoItemAddCombobox from "@/components/app-auto-item-add-combobox";
import AppDate from "@/components/app-date";
import AppFormAction from "@/components/app-form-action";
import { PlusCircle, Trash2 } from "lucide-react";
import useApiUrl from "@/hooks/use-ApiUrl";
import { localStorageKey } from "@/lib/auth-provider";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import type { IGatePassSaveDto } from "../dto/gate-pass-save.dto";
import { Delete, GetAllBuyer, Save, Update } from "../gate-pass.service";
import { GetAllItemTypes } from "@/actions/store/item-type-action";
import { GetAllGmtTypes } from "@/actions/store/gmt-type-action";
import { GetAllGatePassEmp } from "@/actions/store/gate-pass-emp-action";
import { GetAllDepartment } from "@/actions/store/department-action";
import { GetAllUom } from "@/actions/store/uom-action";

const GatepassDetailsSchema = z.object({
    Id: z.number(),
    // GatepassId: z.coerce.number(),
    // GatepasssNo: z.string().nullable().optional(),
    // AccountId: z.coerce.number(),
    // AccountName: z.string(),
    // DebitAmount: z.coerce.number(),
    // CreditAmount: z.coerce.number(),
    // IsDebitAccount: z.boolean(),
});

const formSchema = z.object({
    Id: z.number(),
    gatepassNo: z.string().min(1),
    date: z.date(),
    itemTypeId: z.number(),
    gmtTypeId: z.number(),
    gatePassTypeId: z.number(),
    senderName: z.string(),
    carriedBy: z.string(),
    departmentId: z.number(),
    supplierName: z.string().nullable().optional(),
    supplierId: z.number().optional(),
    details: z.array(GatepassDetailsSchema),
});

type GatepassFormSchema = z.infer<typeof formSchema>;

export default function GatePassForm({
    data,
    pageAction
}: {
    data: IGatePassSaveDto | undefined;
    pageAction: string;
}) {
    const { GatepassType } = useParams();
    console.log('GatepassType', GatepassType);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const navigator = useNavigate();
    const axios = useAxiosInstance();
    const api = useApiUrl();
    console.log(api)

    const itemTypesData = GetAllItemTypes();
    const { data: gmtTypesData } = GetAllGmtTypes();
    const gatePassTypesData = [{ label: 'Returnable', value: 'Returnable' }, { label: 'Not Returnable', value: 'Not Returnable' }];
    const { data: partysData } = GetAllActivesupplier();
    const { data: empolyessData } = GetAllGatePassEmp();
    const { data: departmentData } = GetAllDepartment();
    const { data: uomData } = GetAllUom();
    const { data: buyerData } = GetAllBuyer();


    const mutation = useMutation({
        mutationFn: (tag: IGatePassSaveDto) => {
            if (pageAction === PageAction.add) {
                return Save(tag, axios);
            } else if (pageAction === PageAction.edit) {
                return Update(tag, axios);
            } else if (pageAction === PageAction.delete) {
                return Delete(tag.id!, axios);
            } else {
                throw new Error("Page Action no found.");
            }
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({
            //     queryKey: [ReactQueryKey.AccountGatepass],
            // });
            navigator(`/Gatepass/${GatepassType}`);
        },
        onError: (err: AxiosError) => {
            console.log('error', err.response?.data);
            const res = err.response?.data as IApiResponseType<IGatePassSaveDto>;
            // if (res?.IsError) {
            //     setErrors(res?.Errors);
            // }

            toast.error("Message", {
                position: "top-center",
                description: (
                    <pre className="mt-2 w-[300px] rounded-md  p-4 overflow-auto">
                        <code className="text-white text-sm">
                            {res?.Errors.join("\n")}
                        </code>
                    </pre>
                ),

            })
        },
    });

    // 1. Define your form.
    const form = useForm<GatepassFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.id ?? 0,
            gatepassNo: 'Gate-pass-001',
            date: data?.date ?? undefined,
            itemTypeId: data?.itemTypeId ?? 0,
            gmtTypeId: data?.gmtTypeId ?? 0,
            gatePassTypeId: data?.gatePassTypeId ?? 0,
            senderName: data?.senderName ?? '',
            carriedBy: data?.carriedBy ?? '',
            departmentId: data?.departmentId ?? 0,
            supplierName: data?.supplierName ?? '',
            supplierId: data?.supplierId ?? 0,
            details: []
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "details",
    });

    // 2. Define a submit handler.
    function onSubmit(values: GatepassFormSchema) {
        console.log('submit', values);
        alert(JSON.stringify(values));
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

                // Array errors (like GatepassDetails[0])
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

    async function getTaxDetails(id: number) {
        // setIsLoading(true);
        // const tax = await GetTaxById(axios, id);

        // if (tax.IsError) {
        //     toast("Message", {
        //         position: "top-center",
        //         description: (
        //             <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
        //                 <code className="text-white text-sm">
        //                     {tax.Errors.join("\n")}
        //                 </code>
        //             </pre>
        //         ),
        //     })
        // } else {
        //     // setTaxPercentage(tax?.Data?.Percentage);
        // }
        // setIsLoading(false);
    }

    const handleOnAddRowClick = () => {
        append({
            Id: 0,
            // GatepassId: 0,
            // GatepasssNo: form.getValues("gatepassNo"),
            // AccountId: 0,
            // AccountName: '',
            // DebitAmount: 0,
            // CreditAmount: 0,
            // IsDebitAccount: false,
        })
    };

    const getCurrencyExchangeRate = async (id: number) => {
        setIsLoading(true);
        const companyId = localStorage.getItem(localStorageKey.selectedCompany);

        if (!companyId) {
            return;
        }

        await axios.get(`${api.ProductionUrl}/${companyId}/CurrencyExchangeRates/GetCurrencyExchangeRates_bdt?baseCurrencyId=${id}&exchangeDate=${moment().format('YYYY-MM-DD')}`)
            .then((res) => {
                setIsLoading(false);
                if (res.data) {
                    // form.setValue("currency_exchange_rate_bdt", res.data?.rate_bdt);
                }
            })
            .catch((err) => {
                setIsLoading(false);
                console.log(err);
            })
    }

    return (
        <AppPageContainer>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <AppFormAction pageAction={pageAction} mutationIsPending={mutation.isPending} isLoading={isLoading} navigationLink={`/gate-pass`}>
                        <Button
                            type="button"
                            disabled={mutation.isPending}
                            onClick={() => {
                                const url = `/Gatepass/Gatepass-report?id=${data?.id}&GatepassType=paymentRcv`;
                                window.open(url, "_blank");
                            }}
                            variant={"outline"}
                            className={cn(
                                "w-auto bg-white text-green-600 border border-green-600",
                                "hover:bg-green-200",
                                "w-28", 'cursor-pointer'
                            )}
                            size={"sm"}
                        >
                            Report
                        </Button>

                    </AppFormAction>

                    <div className="min-w-full flex flex-col flex-wrap gap-2 justify-between mt-5">
                        {/* Gate-pass Master */}
                        <div className="w-full flex flex-wrap">
                            <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col gap-3 py-2">
                                {/* Gate-pass Id */}
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

                                {/* Gate-pass No */}
                                <AppInput form={form} name={"gatepassNo"} text={"Gatepass No"} disabled={true} align="horizontal" labelCSS="w-32" />

                                {/* date */}
                                <AppDate form={form} name={"date"} text={"Gatepass Date"} align="horizontal" labelCSS="w-32" />

                                {/* Amount */}
                                {/* <AppInput form={form} name={"Amount"} text={"Amount"} align="horizontal" labelCSS="w-32"
                                    onBlur={() => {
                                        const items = form.getValues("GatepassDetails");
                                        items.forEach((_, index) => {
                                            form.setValue(`GatepassDetails.${index}.DebitAmount`, form.getValues(`GatepassDetails.${index}.IsDebitAccount`) ? form.getValues("Amount") : 0);
                                            form.setValue(`GatepassDetails.${index}.CreditAmount`, form.getValues(`GatepassDetails.${index}.IsDebitAccount`) ? 0 : form.getValues("Amount"));
                                        });

                                    }}
                                /> */}
                                {/* PaymentMethod */}
                                {/* <AppFormCombobox
                                    text="Payment Method"
                                    textFieldName="PaymentMethodName"
                                    valueFieldName="PaymentMethodId"
                                    form={form}
                                    selectItems={PaymentMethods}
                                    onSelectCommandItem={() => {
                                        if (form.getValues("PaymentMethodName") == 'Cheque') {
                                            setChequeInputVisible(true);
                                            //================================
                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        } else if (form.getValues("PaymentMethodName") == 'TT') {
                                            setTTInputVisible(true);
                                            //==================================
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                        } else if (form.getValues("PaymentMethodName") == 'LC') {
                                            setBBLCInputVisible(true);
                                            //================================
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        } else {
                                            setChequeInputVisible(false);
                                            form.setValue("ChequeNumber", '')
                                            form.setValue("ChequeDate", undefined)

                                            setBBLCInputVisible(false);
                                            form.setValue("bb_lc_no", '')

                                            setTTInputVisible(false);
                                            form.setValue("tt_no", '')
                                        }
                                    }}
                                    onClickXButton={() => {
                                        setChequeInputVisible(false);
                                        form.setValue("ChequeNumber", '')
                                        form.setValue("ChequeDate", undefined)
                                        form.setValue("bb_lc_no", '')
                                    }}
                                    align="horizontal" labelCSS="w-32"
                                /> */}
                                {/* <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", chequeInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"ChequeNumber"} text={"Cheque No"} className="flex-1" />
                                    <div className="min-w-40">
                                        <AppDate form={form} name={"ChequeDate"} text={"Cheque Date*"} />
                                    </div>
                                </div>
                                <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", bblcInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"bb_lc_no"} text={"BB L/C No"} className="flex-1" />
                                </div>
                                <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", ttInputVisible ? '' : 'hidden')}>
                                    <AppInput form={form} name={"tt_no"} text={"TT No"} className="flex-1" />
                                </div> */}
                            </div>

                            <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col gap-3 py-2">
                                {/* Payment Terms */}
                                {/* <AppFormCombobox
                                    text="Payment Terms"
                                    textFieldName="PaymentTermsName"
                                    valueFieldName="PaymentTermsId"
                                    form={form}
                                    selectItems={PaymentTerms}
                                    align="horizontal"
                                    labelCSS="w-32"
                                /> */}
                                {/* Party */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Supplier"}
                                    textFieldName={"supplierName"}
                                    valueFieldName={"supplierId"}
                                    selectItems={partysData}
                                    selectItemsLabelFieldName="Name"
                                    selectItemsValueFieldName="Id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                                {/* Tax */}
                                {/* <AppFormCombobox
                                    text={`Tax ${(taxPercentage ? `(${taxPercentage}%)` : '')}`}
                                    textFieldName="TaxName"
                                    valueFieldName="TaxId"
                                    form={form}
                                    selectItems={Taxs}
                                    onSelectCommandItem={() => getTaxDetails(Number(form.getValues("TaxId")))}
                                    align="horizontal"
                                    labelCSS="w-32"
                                /> */}
                                {/* Description */}
                                <AppInput form={form} name={"Description"} text={"Description"} align="horizontal" labelCSS="w-32" />
                            </div>

                            <div className="w-full sm:w-5/12 lg:w-4/12 flex flex-col gap-3 py-2">
                                {/* Master L/C */}
                                {/* <AppFormCombobox
                                    text="Master L/C"
                                    textFieldName="master_lc_number"
                                    valueFieldName="master_lc_id"
                                    form={form}
                                    selectItems={masterLCs}
                                    align="horizontal"
                                    labelCSS="w-32"
                                /> */}
                                <div className="flex w-full gap-1">
                                    <div className="flex-1">
                                        {/* Cuurrency */}
                                        {/* <AppFormCombobox
                                            text="Currency"
                                            textFieldName="currency_name"
                                            valueFieldName="currency_id"
                                            form={form}
                                            selectItems={currencies}
                                            align="horizontal"
                                            labelCSS="w-32"
                                            onSelectCommandItem={() => getCurrencyExchangeRate(Number(form.getValues("currency_id")))}
                                        /> */}
                                    </div>
                                    <div>
                                        <AppInput form={form} name={"currency_exchange_rate_bdt"} text="Ex.R" placeholder={"Exchange Rate"} align="horizontal" />
                                    </div>
                                </div>
                                {/* Gatepass Type */}
                                {/* <AppFormCombobox
                                    text="Gatepass Type"
                                    textFieldName="Gatepass_type_name"
                                    valueFieldName="Gatepass_type_id"
                                    form={form}
                                    selectItems={GatepassTypes}
                                    align="horizontal"
                                    labelCSS="w-32"
                                /> */}
                            </div>

                        </div>

                        {/* Dynamic GatepassDetails */}
                        <div className="space-y-4 border rounded p-4 w-full">
                            <div className="flex flex-wrap justify-between items-center">
                                <h4 className="text-base font-semibold text-black">Gatepass Details</h4>
                                <Button
                                    variant={"outline"}
                                    type="button"
                                    className="border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600"
                                    onClick={handleOnAddRowClick}
                                    size={"sm"}>
                                    <PlusCircle />
                                    Add Row
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap text-black text-center min-w-48">Account Name</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Debit Amount</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Credit Amount</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Is Debit Account</TableHead>
                                        <TableHead className="whitespace-nowrap text-black text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((_item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                {/* <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`GatepassDetails.${index}.AccountName`}
                                                    valueFieldName={`GatepassDetails.${index}.AccountId`}
                                                    selectItems={ChartOfAccounts}
                                                    text="" /> */}
                                            </TableCell>
                                            <TableCell>
                                                <AppInput form={form} name={`GatepassDetails.${index}.DebitAmount`} text={""} inputTextAlign="text-center" />
                                            </TableCell>
                                            <TableCell>
                                                <AppInput form={form} name={`GatepassDetails.${index}.CreditAmount`} text={""} inputTextAlign="text-center" />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {/* <FormField
                                                    control={control}
                                                    name={`GatepassDetails.${index}.IsDebitAccount`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <div className="flex gap-2 justify-center items-center">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                        name={field.name}
                                                                        ref={field.ref}
                                                                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1 leading-none">
                                                                    <FormLabel className=" text-black dark:text-white">{field.value ? 'Yes' : 'No'}</FormLabel>
                                                                </div>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                /> */}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant={"ghost"}
                                                    type="button"
                                                    className="text-red-600 hover:text-white hover:bg-red-600"
                                                    onClick={() => remove(index)}>
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </form>
            </Form>
        </AppPageContainer>
    );
}
