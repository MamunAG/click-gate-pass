import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new'
import React, { useEffect } from 'react'
import { PageAction } from '@/utility/page-actions';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GetAllFactoryPermissions } from '../factory-wise-menu-permission-service';
import { Button } from '@/components/ui/button';
import { PenBoxIcon } from 'lucide-react';



const FactoryWiseMenuPermissionListDetailsSchema = z.object({
    companyId: z.number(),
    companyName: z.string(),
    noOfModule: z.string(),
    noOfMenu: z.string(),
    createdBy: z.string().nullable(),
    updatedBy: z.string().nullable(),
});


const formSchema = z.object({
    factoryWiseMenuPermissionListDetails: z.array(FactoryWiseMenuPermissionListDetailsSchema)
})

type FactoryWiseMenuPermissionListSchema = z.infer<typeof formSchema>;



export default function FactoryWiseMenuPermissionList() {


    const navigator = useNavigate();
    const { data, isLoading } = GetAllFactoryPermissions();


    const form = useForm<FactoryWiseMenuPermissionListSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            factoryWiseMenuPermissionListDetails: []
        }
    })


    useEffect(() => {
        if (!data) return;
        const formatted = data.map(item => ({
            companyId: item.COMPANY_ID,
            companyName: item.FACTORY_NAME,
            noOfModule: item.NO_OF_MODULE,
            noOfMenu: item.NO_OF_MENU,
            createdBy: item.CREATED_BY,
            updatedBy: item.UPDATE_BY,
        }));
        form.reset({ factoryWiseMenuPermissionListDetails: formatted });
    }, [data]);


    return (
        <div className='p-3'>
            <div className=''>
                <Table className="border rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Factory Name</TableHead>
                            <TableHead className="text-center">No of Module</TableHead>
                            <TableHead className="text-center">No of Menu</TableHead>
                            <TableHead className="text-center">Created By</TableHead>
                            <TableHead className="text-center">Updated By</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {form.watch("factoryWiseMenuPermissionListDetails")?.map((row, i) => (
                            <TableRow key={i}>
                                <TableHead className="text-center">{row.companyName}</TableHead>
                                <TableHead className="text-center">{row.noOfModule}</TableHead>
                                <TableHead className="text-center">{row.noOfMenu}</TableHead>
                                <TableHead className="text-center">{row.createdBy ?? "-"}</TableHead>
                                <TableHead className="text-center">{row.updatedBy ?? "-"}</TableHead>
                                <TableHead className="text-center">
                                    <Button className='cursor-pointer'><PenBoxIcon></PenBoxIcon></Button>
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            <div className='mt-5'>
                {/* Show live form values */}
                <pre className="bg-gray-100 p-2 rounded text-sm">
                    {JSON.stringify(form.watch(), null, 2)}
                </pre>
            </div>
        </div>
    )
}
