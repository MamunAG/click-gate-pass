import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { PageAction } from '@/utility/page-actions';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FactoryWiseMenuPermissionIndexTable } from './index-page/factory-wise-menu-permission-list-table';
import { IFacotryWiseMenuPermissionIndex } from './index-page/factory-wise-menu-permission-index-dto';
import { GetAllFactoryPermissions } from './factory-wise-menu-permission-service';

export default function FactoryWiseMenuPermissionIndex() {

    const [FactoryWiseMenuPermissionListData, setFactoryWiseMenuPermissionListDataData] = useState<IFacotryWiseMenuPermissionIndex[]>([]);
    const { data, isLoading } = GetAllFactoryPermissions();

    useEffect(() => {
        if (!data) return;
        const formatted: IFacotryWiseMenuPermissionIndex[] = data.map(item => ({
            companyId: item.COMPANY_ID,
            companyName: item.FACTORY_NAME,
            noOfModule: item.NO_OF_MODULE,
            noOfMenu: item.NO_OF_MENU,
            createdBy: item.CREATED_BY,
            updatedBy: item.UPDATE_BY
        }));
        setFactoryWiseMenuPermissionListDataData(formatted);
    }, [data]);


    const navigator = useNavigate();
    return (
        <div className='p-3'>
            <BreadcrumbAddNew
                addNewButtonText="Add New"
                handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

            <div>
                <FactoryWiseMenuPermissionIndexTable data={FactoryWiseMenuPermissionListData} />
            </div>
        </div>
    )
}
