import React, { useState } from 'react'
import { PageAction } from '../../../utility/page-actions';
import { useNavigate, useParams } from 'react-router-dom';
import AppPageContainer from '@/components/AppPageContainerProps';
import AppFormAction from '@/components/app-form-action';
import { IGatePassSaveDto } from '@/pages/gate-pass/dto/gate-pass-save.dto';
import { Delete, Save, Update } from '@/pages/gate-pass/gate-pass.service';
import axios, { AxiosError } from 'axios';
import { IApiResponseType } from '@/actions/api-response-type';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { GetCompaniesByType, GetCompanyTypes, GetMenusByModuleIdZero } from '../factory-wise-menu-permission-service';
import AppAutoItemAddCombobox from '@/components/app-auto-item-add-combobox';
import { z } from "zod";
import { Form } from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { localStorageKey } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { companyId } from '@/utility/app-data';
import FactoryPermissionTable, { IFactoryRow } from './factory-permission-table';


const FactoryWiseMenuPermissionFormDetailsSchema = z.object({
    id: z.number(),
    companyId: z.number(),
    companyTypeId: z.number(),

    moduleId: z.number(),
    moduleName: z.string().nullable(),

    menuId: z.number(),
    menuName: z.string(),

    isActive: z.boolean(),
    companyName: z.string().nullable(),
    companyUnitType: z.string().nullable(),
});




type FactoryWiseMenuPermissionFormSchema = z.infer<typeof formSchema>;


const formSchema = z.object({
    companyTypeId: z.number().optional(),
    companyId: z.number().optional(),
    moduleId: z.number().optional(),
    moduleName: z.string().optional(),
    details: z.array(FactoryWiseMenuPermissionFormDetailsSchema)
})

export default function FactoryWiseMenuPermissionForm({
    pageAction
}: {
    pageAction: string;
}) {

    const { FactoryWiseMenuPermissionType } = useParams();
    // console.log('FactoryWiseMenuPermissionType', FactoryWiseMenuPermissionType);
    const navigator = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // inside component
    const [rows, setRows] = useState<IFactoryRow[]>([])
    const [tableHasData, setTableHasData] = useState(false);
    // Add button handler
    const handleAdd = () => {
        const selectedCompanyId = form.getValues("companyId")
        const selectedCompanyTypeId = form.getValues("companyTypeId")

        const company = companies?.find(c => c.id === selectedCompanyId)
        const unitType = companyTypes?.find(c => c.companyTypeId === selectedCompanyTypeId)

        if (!company || !unitType) return

        // prevent duplicates
        const exists = rows.some(r => r.companyId === company.id && r.companyTypeId === unitType.companyTypeId)
        if (exists) {
            toast("This factory is already added.")
            return
        }

        // add new row
        setRows([
            ...rows,
            {
                companyId: company.id,
                companyName: company.name,
                companyTypeId: unitType.companyTypeId,
                companyUnitType: unitType.companyTypeName,
                isActive: true,
            },
        ])
        setTableHasData(true);
    }



    const form = useForm<FactoryWiseMenuPermissionFormSchema>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            details: [

            ]
        }
    })


    const { control, handleSubmit } = form;
    // const { fields, append, remove } = useFieldArray({
    //     control,
    //     name: "details",
    // })

    function onSubmit(values: FactoryWiseMenuPermissionFormSchema) {
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

                if (Array.isArray(value)) {
                    return value.flatMap((item, index) =>
                        extractMessages(item, `${fullKey}[${index}]`)
                    );
                }

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


    const companyId = localStorage.getItem(localStorageKey.selectedCompany) ?? 1;
    const { data: companyTypes } = GetCompanyTypes(Number(companyId));
    const selectedCompanyTypeId = form.watch("companyTypeId");
    console.log(selectedCompanyTypeId)
    const { data: companies } = GetCompaniesByType(Number(selectedCompanyTypeId));
    const { data: modules } = GetMenusByModuleIdZero(Number(selectedCompanyTypeId), tableHasData);



    return (
        <div className='grid grid-cols-1'>
            <AppPageContainer>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
                        <div className='grid grid-cols-2 gap-2'>
                            <div className=''>
                                <div className='flex gap-2'>
                                    <AppAutoItemAddCombobox
                                        form={form}
                                        text={"Factory Type"}
                                        textFieldName={"companyUnitType"}
                                        valueFieldName={"companyTypeId"}
                                        selectItems={companyTypes}
                                        selectItemsLabelFieldName="companyTypeName"
                                        selectItemsValueFieldName="companyTypeId"
                                        align="horizontal"
                                        labelCSS="w-32"
                                    />
                                    <div>
                                        <Button><Plus /> Add All</Button>
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <AppAutoItemAddCombobox
                                        form={form}
                                        text={"Factory Name"}
                                        textFieldName={"companyName"}
                                        valueFieldName={"companyId"}
                                        selectItems={companies}
                                        selectItemsLabelFieldName="name"
                                        selectItemsValueFieldName="id"
                                        align="horizontal"
                                        labelCSS="w-32"
                                    />
                                    <div>
                                        <Button onClick={handleAdd}><Plus></Plus>Add</Button>
                                    </div>
                                </div>

                                <div>
                                    <FactoryPermissionTable rows={rows} setRows={setRows} />
                                </div>




                                <div className='mt-5'>
                                    {/* Show live form values */}
                                    <pre className="bg-gray-100 p-2 rounded text-sm">
                                        {JSON.stringify(form.watch(), null, 2)}
                                    </pre>
                                </div>
                            </div>


                            <div>
                                <AppAutoItemAddCombobox
                                    form={form}
                                    text={"Module"}
                                    textFieldName={"moduleName"}
                                    valueFieldName={"moduleId"}
                                    selectItems={modules}
                                    selectItemsLabelFieldName="MODULE_NAME"
                                    selectItemsValueFieldName="MODULE_ID"
                                    align="horizontal"
                                    labelCSS="w-32"
                                />
                            </div>
                        </div>
                    </form>
                </Form>
            </AppPageContainer>
        </div >
    )
}
