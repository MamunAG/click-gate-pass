import { GatePassTable } from './index-page/gate-pass-table'
import GatePassIndexForm, { type formIndexType } from './index-page/gate-pass-index-form'
import { GatePassData } from './index-page/gate-pass.data';
import React from 'react';
import type { IGatePassIndex } from './index-page/gate-pass.dto';
import { useNavigate } from 'react-router-dom';
import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { PageAction } from '@/utility/page-actions';

export default function GatePassIndex() {
    const [data, setData] = React.useState<IGatePassIndex[]>([]);
    const [filterData, setFilterData] = React.useState<IGatePassIndex[]>([]);
    React.useEffect(() => { setData(GatePassData); setFilterData(GatePassData) }, [])

    function handleIndexFormSubmit({ createdBy, fromDate, toDate }: formIndexType) {
        let filterData = data;
        if (createdBy) {
            filterData = filterData.filter(_ => _.createdBy.includes(createdBy));
        }
        if (fromDate) {
            filterData = filterData.filter(_ => new Date(_.date) >= fromDate);
        }
        if (toDate) {
            filterData = filterData.filter(_ => new Date(_.date) <= toDate);
        }
        setFilterData(filterData);
    }

    const navigator = useNavigate();
    return (
        <div className='p-3'>
            <BreadcrumbAddNew
                addNewButtonText="Add New Gate-pass"
                handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />
            <div>
                <GatePassIndexForm handleIndexFormSubmit={handleIndexFormSubmit} />
            </div>
            <div className='mt-5'>
                <GatePassTable data={filterData} />
            </div>
        </div>
    )
}
