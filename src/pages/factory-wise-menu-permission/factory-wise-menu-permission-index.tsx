import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { PageAction } from '@/utility/page-actions';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import FactoryWiseMenuPermissionList from './index-page/factory-wise-menu-permission-list';

export default function FactoryWiseMenuPermissionIndex() {





    const navigator = useNavigate();
    return (
        <div className='p-3'>
            <BreadcrumbAddNew
                addNewButtonText="Add New"
                handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

            <div>
                <FactoryWiseMenuPermissionList />
            </div>
        </div>
    )
}
