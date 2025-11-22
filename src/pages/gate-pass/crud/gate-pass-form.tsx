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
import { useMutation } from "@tanstack/react-query";
import type { IGatePassSaveDto } from "../dto/gate-pass-save.dto";
import { Delete, GetAllBuyer, GetAllMaterial, GetAllPoByStyle, GetAllStyleByBuyer, Save, Update } from "../gate-pass.service";
import { GetAllItemTypes } from "@/actions/store/item-type-action";
import { GetAllGmtTypes } from "@/actions/store/gmt-type-action";
import { GetAllGatePassEmp } from "@/actions/store/gate-pass-emp-action";
import { GetAllDepartment } from "@/actions/store/department-action";
import { GetAllUom } from "@/actions/store/uom-action";
import AppFormCombobox from "@/components/app-form-combobox";
import { AppSheet } from "@/components/AppSheet";
import TaxForm from "@/pages/Tax/Tax-form";
import { SelectItemType } from "@/types/selectItemType";

const GatepassDetailsSchema = z.object({
    Id: z.number(),
    buyer: z.string(),
    buyerId: z.number(),

    style: z.string(),
    styleId: z.number(),

    po: z.string(),
    poId: z.number(),

    program: z.string(),
    programId: z.number(),

    item: z.string(),
    itemId: z.number(),

    color: z.string(),
    colorId: z.number(),

    size: z.string(),
    sizeId: z.number(),

    quantity: z.number(),

    uom: z.string(),
    uomId: z.number(),
});

const formSchema = z.object({
    Id: z.number(),
    gatepassNo: z.string().min(1),
    date: z.date(),
    itemType: z.string().optional(),
    itemTypeId: z.number(),
    gmtType: z.string().optional(),
    gmtTypeId: z.number(),
    gatePassType: z.string().optional(),
    gatePassTypeId: z.number(),
    sender: z.string(),
    senderId: z.number(),
    senderPhoneNo: z.string().optional(),
    carriedBy: z.string(),
    carriedById: z.number().optional(),
    department: z.string().optional(),
    departmentId: z.number(),
    supplier: z.string().nullable().optional(),
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
    console.log(setIsLoading)

    const itemTypesData = GetAllItemTypes();
    const { data: gmtTypesData } = GetAllGmtTypes();
    const gatePassTypesData = [{ label: 'Returnable', value: 1 }, { label: 'Not Returnable', value: 2 }];
    const { data: partysData } = GetAllActivesupplier();
    const { data: empolyessData } = GetAllGatePassEmp();
    const { data: departmentData } = GetAllDepartment();
    const { data: uomData } = GetAllUom();
    const { data: buyerData } = GetAllBuyer();
    const { data: itemData } = GetAllMaterial();
    const [stylesByBuyerData, setStylesByBuyerData] = React.useState<Record<string, SelectItemType[]>>({});
    const [poByStyleData, setPoByStyleData] = React.useState<Record<string, SelectItemType[]>>({});

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
            sender: data?.sender ?? '',
            carriedBy: data?.carriedBy ?? '',
            departmentId: data?.departmentId ?? 0,
            supplier: data?.supplier ?? '',
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


    const handleOnAddRowClick = () => {
        append({
            Id: 0,
            buyerId: 0,
            buyer: '',
            styleId: 0,
            style: '',
            poId: 0,
            po: '',
            programId: 0,
            program: '',
            itemId: 0,
            item: '',
            colorId: 0,
            color: '',
            sizeId: 0,
            size: '',
            quantity: 0,
            uomId: 0,
            uom: ''
        })
    };

    return (
        <AppPageContainer>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                    <AppFormAction pageAction={pageAction} mutationIsPending={mutation.isPending} isLoading={isLoading} navigationLink={`/dashboard/gate-pass`}>
                        <AppSheet
                            title="New UOM"
                            btnText='UOM'
                            onOpenChange={(er) => console.log(er)}>
                            <TaxForm data={undefined} pageAction={PageAction.add} isPopup={true} />
                        </AppSheet>
                        <Button
                            type="button"
                            disabled={mutation.isPending}
                            onClick={() => {
                                const url = `/Gatepass/Gatepass-report?id=${data?.id}&GatepassType=paymentRcv`;
                                window.open(url, "_blank");
                            }}
                            variant={"outline"}
                            className={cn("w-28", 'cursor-pointer')}
                            size={"sm"}
                        >
                            Report
                        </Button>
                    </AppFormAction>

                    <div className="flex flex-col flex-wrap gap-2 justify-between mt-5">
                        {/* Gate-pass Master */}
                        <div className="w-full flex flex-wrap">
                            <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col gap-1 py-2">
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

                                {/* Item Type */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Item Type"}
                                    textFieldName={"itemType"}
                                    valueFieldName={"itemTypeId"}
                                    selectItems={itemTypesData}
                                    selectItemsLabelFieldName="name"
                                    selectItemsValueFieldName="id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                                {/* GMT Type */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"GMT Type"}
                                    textFieldName={"gmtType"}
                                    valueFieldName={"gmtTypeId"}
                                    selectItems={
                                        gmtTypesData?.map((_, i) => ({ ..._, id: i }))
                                    }
                                    selectItemsLabelFieldName="name"
                                    selectItemsValueFieldName="id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                                {/* Gate-pass Type */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Gate-pass Type"}
                                    textFieldName={"gatePassType"}
                                    valueFieldName={"gatePassTypeId"}
                                    selectItems={gatePassTypesData}
                                    selectItemsLabelFieldName="label"
                                    selectItemsValueFieldName="value"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                            </div>

                            <div className="w-full sm:w-6/12 lg:w-4/12 flex flex-col gap-1 py-2">
                                {/* Sender */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Sender"}
                                    textFieldName={"sender"}
                                    valueFieldName={"senderId"}
                                    selectItems={
                                        empolyessData?.map((_, i) => ({ ..._, id: i }))
                                    }
                                    selectItemsLabelFieldName="name"
                                    selectItemsValueFieldName="id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />

                                {/* Sender Phone */}
                                <AppInput form={form} name={"senderPhoneNo"} text={"Sender Phone"} disabled={false} align="horizontal" labelCSS="w-32" />


                                {/* Supplier */}
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Supplier"}
                                    textFieldName={"supplier"}
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

                            <div className="w-full sm:w-5/12 lg:w-3/12 flex flex-col gap-1 py-2">
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Carried By"}
                                    textFieldName={"carriedBy"}
                                    valueFieldName={"carriedById"}
                                    selectItems={
                                        empolyessData?.map((_, i) => ({ ..._, id: i }))
                                    }
                                    selectItemsLabelFieldName="name"
                                    selectItemsValueFieldName="id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Department"}
                                    textFieldName={"department"}
                                    valueFieldName={"departmentId"}
                                    selectItems={
                                        departmentData?.map((_, i) => ({ ..._, id: i }))
                                    }
                                    selectItemsLabelFieldName="name"
                                    selectItemsValueFieldName="id"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                            </div>
                        </div>

                        {/* Gate-pass Details */}
                        <div className="space-y-4 border rounded-lg p-4 min-h-64 w-full overflow-auto max-w-7xl">
                            <div className="flex flex-wrap justify-between items-center">
                                <h4 className="text-base font-semibold ">Gatepass Details</h4>
                                <Button
                                    variant={"outline"}
                                    type="button"
                                    className="border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 cursor-pointer"
                                    onClick={handleOnAddRowClick}
                                    size={"sm"}>
                                    <PlusCircle />
                                    Add Row
                                </Button>
                            </div>
                            <Table>
                                <TableHeader className="">
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap text-center">Buyer</TableHead>
                                        <TableHead className="whitespace-nowrap text-center">Style</TableHead>
                                        <TableHead className="whitespace-nowrap text-center">PO</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Program</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Item</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Color</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Size</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center min-w-24">Quantity</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Uom</TableHead>
                                        <TableHead className="whitespace-nowrap  text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((_item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.buyer`}
                                                    valueFieldName={`details.${index}.buyerId`}
                                                    selectItems={buyerData?.map(_ => ({ label: _.NAME?.toString(), value: _.Id?.toString() })) ?? []}
                                                    text=""
                                                    onSelectCommandItem={async () => {
                                                        const buyerId = form.getValues(`details.${index}.buyerId`)
                                                        const styles = await GetAllStyleByBuyer(axios, Number(buyerId));
                                                        const styleEntities = styles?.map(_ => ({ label: _.Styleno?.toString(), value: _.Id?.toString() }))
                                                        setStylesByBuyerData(pre => ({ ...pre, [buyerId.toString()]: styleEntities }))
                                                    }} />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.style`}
                                                    valueFieldName={`details.${index}.styleId`}
                                                    selectItems={stylesByBuyerData[form.getValues(`details.${index}.buyerId`)] ?? []}
                                                    onSelectCommandItem={async () => {
                                                        const styleId = form.getValues(`details.${index}.styleId`)
                                                        const pos = await GetAllPoByStyle(axios, Number(styleId));
                                                        const poEntities = pos?.map(_ => ({ label: _.Pono?.toString(), value: _.Id?.toString() }))
                                                        setPoByStyleData(pre => ({ ...pre, [styleId.toString()]: poEntities }))
                                                    }} />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.po`}
                                                    valueFieldName={`details.${index}.poId`}
                                                    selectItems={poByStyleData[form.getValues(`details.${index}.styleId`)] ?? []}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.program`}
                                                    valueFieldName={`details.${index}.programId`}
                                                    selectItems={buyerData?.map(_ => ({ label: _.NAME?.toString(), value: _.Id?.toString() })) ?? []}
                                                    text="" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.item`}
                                                    valueFieldName={`details.${index}.itemId`}
                                                    selectItems={itemData?.data?.map((_: any) => ({ label: _.name?.toString(), value: _.id?.toString() })) ?? []}
                                                    text="" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.color`}
                                                    valueFieldName={`details.${index}.colorId`}
                                                    selectItems={buyerData?.map(_ => ({ label: _.NAME?.toString(), value: _.Id?.toString() })) ?? []}
                                                    text="" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.size`}
                                                    valueFieldName={`details.${index}.sizeId`}
                                                    selectItems={buyerData?.map(_ => ({ label: _.NAME?.toString(), value: _.Id?.toString() })) ?? []}
                                                    text="" />
                                            </TableCell>
                                            <TableCell>
                                                <AppInput form={form} name={`details.${index}.quantity`} text={""} inputTextAlign="text-center" />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <AppFormCombobox
                                                    form={form}
                                                    textFieldName={`details.${index}.uom`}
                                                    valueFieldName={`details.${index}.uomId`}
                                                    selectItems={uomData?.map(_ => ({ label: _.Name?.toString(), value: _.Id?.toString() })) ?? []}
                                                    text="" />
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant={"ghost"}
                                                    type="button"
                                                    className=" text-red-600 border border-red-600 hover:text-white hover:bg-red-600 p-1"
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
