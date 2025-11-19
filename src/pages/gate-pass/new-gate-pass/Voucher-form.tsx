/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
    type IVoucher,
    Delete,
    Save,
    Update,
} from "@/actions/accounting/voucher-action";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GetAllActivePaymentMethod } from "@/actions/accounting/payment-method-action";
import { toast } from "sonner";
import { GetAllActiveChartOfAccount } from "@/actions/accounting/account-action";
import { GetAllActivesupplier } from "@/actions/configuration/supplier-action";
import { GetAllActiveTax, GetTaxById } from "@/actions/accounting/tax-action";
import { GetAllActivePaymentTerms } from "@/actions/accounting/payment-terms-action";
import type { IApiResponseType } from "@/actions/api-response-type";
import AppInput from "@/components/app-input";
import AppAutoItemAddCombobox from "@/components/app-auto-item-add-combobox";
import AppDate from "@/components/app-date";
import AppFormAction from "@/components/app-form-action";
import { PlusCircle, Trash2 } from "lucide-react";
import { GetAllActiveIVoucherType } from "@/actions/accounting/voucher-type-action";
import { GetAllActiveMasterLC } from "@/actions/accounting/master-lc-action";
import { PaymentVoucherType } from "./components/voucher-types";
import { GetAllActivecurrency } from "@/actions/configuration/currency-action";
import useApiUrl from "@/hooks/use-ApiUrl";
import { localStorageKey } from "@/lib/auth-provider";
import moment from "moment";
import type { SelectItemType } from "@/types/selectItemType";
import { useMutation, useQueryClient } from "@tanstack/react-query";


const voucherDetailsSchema = z.object({
    Id: z.number(),
    // VoucherId: z.coerce.number(),
    // VouchersNo: z.string().nullable().optional(),
    // AccountId: z.coerce.number(),
    // AccountName: z.string(),
    // DebitAmount: z.coerce.number(),
    // CreditAmount: z.coerce.number(),
    // IsDebitAccount: z.boolean(),
});

const formSchema = z.object({
    Id: z.number(),
    VoucherNo: z.string().min(1),
    // VoucherDate: z.coerce.date(),
    // TransactionTypeId: z.coerce.number(),
    // TransactionTypeName: z.string().nullable().optional(),
    // Amount: z.coerce.number(),
    // PaymentMethodId: z.coerce.number().optional(),
    // PaymentMethodName: z.string().nullable().optional(),
    // PaymentTermsId: z.coerce.number().optional(),
    // PaymentTermsName: z.string().nullable().optional(),
    // ChequeNumber: z.string().optional(),
    // ChequeDate: z.coerce.date().optional().nullable(),
    // TaxId: z.coerce.number().optional(),
    // TaxName: z.string().nullable().optional(),
    // PartyId: z.coerce.number().optional(),
    // PartyName: z.string().nullable().optional(),
    // ProjectId: z.coerce.number().optional(),
    // ProjectName: z.string().nullable().optional(),

    // master_lc_id: z.coerce.number().optional(),
    // master_lc_number: z.string().nullable().optional(),

    // voucher_type_id: z.coerce.number().optional(),
    // voucher_type_name: z.string().nullable().optional(),

    // currency_id: z.coerce.number().optional(),
    // currency_name: z.string().nullable().optional(),
    // currency_exchange_rate_bdt: z.coerce.number().optional().default(0),

    // Description: z.string(),

    // bb_lc_no: z.string().optional(),
    // tt_no: z.string().optional(),

    VoucherDetails: z.array(voucherDetailsSchema),
});

type VoucherFormSchema = z.infer<typeof formSchema>;

export default function VoucherForm({
    data,
    pageAction
}: {
    data: IVoucher | undefined;
    pageAction: string;
}) {
    // console.log("gauge: ", data);

    const { voucherType } = useParams();
    console.log('voucherType', voucherType);

    const [Errors, setErrors] = React.useState<string[] | null>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [taxPercentage, setTaxPercentage] = React.useState<number | null>(null);
    const [chequeInputVisible, setChequeInputVisible] = React.useState<boolean>(data?.PaymentMethodName === 'Cheque' ? true : false);
    const [bblcInputVisible, setBBLCInputVisible] = React.useState<boolean>(data?.PaymentMethodName === 'LC' ? true : false);
    const [ttInputVisible, setTTInputVisible] = React.useState<boolean>(data?.PaymentMethodName === 'TT' ? true : false);
    const [ChartOfAccounts, setChartOfAccounts] = React.useState<SelectItemType[]>([])
    const [PaymentMethods, setPaymentMethods] = React.useState<SelectItemType[]>([])
    const [PaymentTerms, setPaymentTerms] = React.useState<SelectItemType[]>([])
    const [Parties, setParties] = React.useState<SelectItemType[]>([])
    const [voucherTypes, setVoucherTypes] = React.useState<SelectItemType[]>([])
    const [masterLCs, setMasterLCs] = React.useState<SelectItemType[]>([])
    const [currencies, setCurrencies] = React.useState<SelectItemType[]>([])

    const [Taxs, setTaxs] = React.useState<SelectItemType[]>([])

    const queryClient = useQueryClient();
    const navigator = useNavigate();
    const axios = useAxiosInstance();
    const api = useApiUrl();
    console.log(api)

    const { data: paymentMethodsData } = GetAllActivePaymentMethod();
    const { data: paymentTermsData } = GetAllActivePaymentTerms();
    const { data: partysData } = GetAllActivesupplier();
    const { data: chartOfAccountsData } = GetAllActiveChartOfAccount();
    const { data: taxData } = GetAllActiveTax();
    const { data: voucherTypeData } = GetAllActiveIVoucherType();
    const { data: masterLCData } = GetAllActiveMasterLC();
    const { data: currencyData } = GetAllActivecurrency();

    console.log("gauge: ", Errors);
    console.log("currencies: ", currencies);

    React.useEffect(() => {
        if (data && (data.TaxId ?? 0) > 0) { getTaxDetails(data.TaxId!); }
        getCurrencyExchangeRate(1);
    }, [])

    React.useEffect(() => {
        if (currencyData?.IsError) {
            setErrors(currencyData.Errors);
        } else {
            const _: SelectItemType[] = [];
            currencyData?.Data?.forEach((element: any) => {
                _.push({ label: `${element.code}`, value: element.id.toString() });
            });

            setCurrencies([..._]);
        }
    }, [currencyData])

    React.useEffect(() => {
        if (masterLCData?.IsError) {
            setErrors(masterLCData.Errors);
        } else {
            const _: SelectItemType[] = [];
            masterLCData?.Data?.forEach((element: any) => {
                _.push({ label: `${element.master_lc_no}`, value: element.id.toString() });
            });

            setMasterLCs([..._]);
        }
    }, [masterLCData])

    React.useEffect(() => {
        if (chartOfAccountsData?.IsError) {
            setErrors(chartOfAccountsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            chartOfAccountsData?.Data?.forEach((element: any) => {
                _.push({ label: `${element.Name} || ${element.AccountTypeName}`, value: element.Id.toString() });
            });

            setChartOfAccounts([..._]);
        }
    }, [chartOfAccountsData])

    React.useEffect(() => {
        if (voucherTypeData?.IsError) {
            setErrors(voucherTypeData.Errors);
        } else {
            const _: SelectItemType[] = [];
            voucherTypeData?.Data?.forEach((element: any) => {
                _.push({ label: `${element.Name}`, value: element.Id.toString() });
            });

            setVoucherTypes([..._]);
        }
    }, [voucherTypeData])

    React.useEffect(() => {
        if (paymentMethodsData?.IsError) {
            setErrors(paymentMethodsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            paymentMethodsData?.Data?.forEach((element: any) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setPaymentMethods([..._]);
        }
    }, [paymentMethodsData])

    React.useEffect(() => {
        if (paymentTermsData?.IsError) {
            setErrors(paymentTermsData.Errors);
        } else {
            const _: SelectItemType[] = [];
            paymentTermsData?.Data?.forEach((element: any) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setPaymentTerms([..._]);
        }
    }, [paymentTermsData])


    React.useEffect(() => {
        if (partysData?.IsError) {
            setErrors(partysData.Errors);
        } else {
            const _: SelectItemType[] = [];
            partysData?.Data?.forEach((element: any) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setParties([..._]);
        }
    }, [partysData])

    React.useEffect(() => {
        if (taxData?.IsError) {
            setErrors(taxData.Errors);
        } else {
            const _: SelectItemType[] = [];
            taxData?.Data?.forEach((element: any) => {
                _.push({ label: element.Name, value: element.Id.toString() });
            });

            setTaxs([..._]);
        }
    }, [taxData])

    const mutation = useMutation({
        mutationFn: (tag: IVoucher) => {
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
                queryKey: [ReactQueryKey.AccountVoucher],
            });
            navigator(`/voucher/${voucherType}`);
        },
        onError: (err: AxiosError) => {
            console.log('error', err.response?.data);
            const res = err.response?.data as IApiResponseType<IVoucher>;
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
    const form = useForm<VoucherFormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Id: data?.Id ?? 0,
            VoucherNo: data?.VoucherNo ?? '',
            // VoucherDate: data?.VoucherDate,
            // TransactionTypeId: data?.TransactionTypeId,
            // TransactionTypeName: data?.TransactionTypeName,
            // Amount: data?.Amount,
            // PaymentMethodId: data?.PaymentMethodId,
            // PaymentMethodName: data?.PaymentMethodName,
            // PaymentTermsId: data?.PaymentTermsId,
            // PaymentTermsName: data?.PaymentTermsName,
            // ChequeNumber: data?.ChequeNumber ?? '',
            // ChequeDate: data?.ChequeDate,
            // TaxId: data?.TaxId,
            // TaxName: data?.TaxName,
            // PartyId: data?.PartyId,
            // PartyName: data?.PartyName ?? '',
            // ProjectId: data?.ProjectId,
            // ProjectName: data?.ProjectName ?? '',
            // Description: data?.Description ?? '',
            // master_lc_id: data?.master_lc_id,
            // master_lc_number: data?.master_lc_number ?? '',
            // voucher_type_id: data?.voucher_type_id ?? (voucherType == 'Payment Voucher' ? 1 : 2),
            // voucher_type_name: data?.voucher_type_name,
            // bb_lc_no: data?.bb_lc_no ?? '',
            // tt_no: data?.tt_no ?? '',
            // currency_id: data?.currency_id ?? 1,
            // currency_name: data?.currency_name ?? 'BDT',
            // currency_exchange_rate_bdt: data?.currency_exchange_rate_bdt,

            VoucherDetails: data?.VoucherDetails,
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "VoucherDetails",
    });

    // 2. Define a submit handler.
    function onSubmit(values: VoucherFormSchema) {
        console.log('submit', values);
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

    async function getTaxDetails(id: number) {
        setIsLoading(true);
        const tax = await GetTaxById(axios, id);

        if (tax.IsError) {
            toast("Message", {
                position: "top-center",
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4 overflow-auto">
                        <code className="text-white text-sm">
                            {tax.Errors.join("\n")}
                        </code>
                    </pre>
                ),
            })
        } else {
            setTaxPercentage(tax?.Data?.Percentage);
        }
        setIsLoading(false);
    }

    const handleOnAddRowClick = () => {
        append({
            Id: 0,
            // VoucherId: 0,
            // VouchersNo: form.getValues("VoucherNo"),
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
                    <div className="min-w-full flex flex-col flex-wrap gap-2 justify-between">
                        {/* Voucher Master */}
                        <div className="w-full flex flex-wrap">
                            <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col gap-3 py-2">
                                {/* Voucher Id */}
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

                                {/* Voucher No */}
                                <AppInput form={form} name={"VoucherNo"} text={"Voucher No"} disabled={true} align="horizontal" labelCSS="w-32" />

                                {/* VoucherDate */}
                                <AppDate form={form} name={"VoucherDate"} text={"Voucher Date"} align="horizontal" labelCSS="w-32" />

                                {/* Amount */}
                                {/* <AppInput form={form} name={"Amount"} text={"Amount"} align="horizontal" labelCSS="w-32"
                                    onBlur={() => {
                                        const items = form.getValues("VoucherDetails");
                                        items.forEach((_, index) => {
                                            form.setValue(`VoucherDetails.${index}.DebitAmount`, form.getValues(`VoucherDetails.${index}.IsDebitAccount`) ? form.getValues("Amount") : 0);
                                            form.setValue(`VoucherDetails.${index}.CreditAmount`, form.getValues(`VoucherDetails.${index}.IsDebitAccount`) ? 0 : form.getValues("Amount"));
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
                                <div className={cn("flex w-full gap-1 border border-red p-3 rounded-lg", chequeInputVisible ? '' : 'hidden')}>
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
                                </div>
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
                                    text={"Party"}
                                    textFieldName={"PartyName"}
                                    valueFieldName={"PartyId"}
                                    selectItems={Parties}
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
                                {/* Voucher Type */}
                                {/* <AppFormCombobox
                                    text="Voucher Type"
                                    textFieldName="voucher_type_name"
                                    valueFieldName="voucher_type_id"
                                    form={form}
                                    selectItems={voucherTypes}
                                    align="horizontal"
                                    labelCSS="w-32"
                                /> */}
                            </div>

                        </div>

                        {/* Dynamic VoucherDetails */}
                        <div className="space-y-4 border rounded p-4 w-full">
                            <div className="flex flex-wrap justify-between items-center">
                                <h4 className="text-base font-semibold text-black">Voucher Details</h4>
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
                                                    textFieldName={`VoucherDetails.${index}.AccountName`}
                                                    valueFieldName={`VoucherDetails.${index}.AccountId`}
                                                    selectItems={ChartOfAccounts}
                                                    text="" /> */}
                                            </TableCell>
                                            <TableCell>
                                                <AppInput form={form} name={`VoucherDetails.${index}.DebitAmount`} text={""} inputTextAlign="text-center" />
                                            </TableCell>
                                            <TableCell>
                                                <AppInput form={form} name={`VoucherDetails.${index}.CreditAmount`} text={""} inputTextAlign="text-center" />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {/* <FormField
                                                    control={control}
                                                    name={`VoucherDetails.${index}.IsDebitAccount`}
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
                    <AppFormAction pageAction={pageAction} mutationIsPending={mutation.isPending} isLoading={isLoading} navigationLink={`/gate-pass/${voucherType}`}>
                        {voucherType === PaymentVoucherType ?
                            <Button
                                type="button"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    const url = `/voucher/voucher-report?id=${data?.Id}&voucherType=payment`;
                                    window.open(url, "_blank");
                                }}
                                variant={"outline"}
                                className={cn(
                                    "w-auto bg-white text-green-600 border border-green-600",
                                    "hover:bg-green-500 hover:text-white"
                                )}
                                size={"sm"}
                            >
                                Payment Voucher
                            </Button> :
                            <Button
                                type="button"
                                disabled={mutation.isPending}
                                onClick={() => {
                                    const url = `/voucher/voucher-report?id=${data?.Id}&voucherType=paymentRcv`;
                                    window.open(url, "_blank");
                                }}
                                variant={"outline"}
                                className={cn(
                                    "w-auto bg-white text-green-600 border border-green-600",
                                    "hover:bg-green-500 hover:text-white"
                                )}
                                size={"sm"}
                            >
                                Receive Voucher
                            </Button>
                        }
                    </AppFormAction>
                </form>
            </Form>
        </AppPageContainer>
    );
}
