import { GatePassTable } from './index-page-components/gate-pass-table'
import GatePassIndexForm, { type formIndexType } from './index-page-components/gate-pass-index-form'
import { GatePassData } from './index-page-components/gate-pass.data';
import React from 'react';
import type { IGatePassIndex } from './index-page-components/gate-pass.dto';
import { useNavigate } from 'react-router-dom';
import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { PageAction } from '@/utility/page-actions';
// import useAxiosInstance from '@/lib/axios-instance';
// import { GetAllGmtTypes } from '@/actions/store/gmt-type-action';


export default function GatePassIndex() {
    const [data, setData] = React.useState<IGatePassIndex[]>([]);
    React.useEffect(() => setData(GatePassData), [])

    // const axios = useAxiosInstance();

    // const da = GetAllGmtTypes(axios);

    function handleIndexFormSubmit({ createdBy, fromDate, toDate }: formIndexType) {
        let filterData = data;
        if (createdBy) {
            filterData = filterData.filter(_ => _.createdBy == createdBy);
        }
        if (fromDate) {
            filterData = filterData.filter(_ => new Date(_.date) >= fromDate);
        }
        if (toDate) {
            filterData = filterData.filter(_ => new Date(_.date) <= toDate);
        }
        setData(filterData);
    }

    const navigator = useNavigate();
    return (
        <div>
            <BreadcrumbAddNew
                pageName="Gate-pass"
                addNewButtonText="Add New Gate-pass"
                handleNavigateToAddNewPage={() => navigator(`${PageAction.add}/0`)} />

            {/* <div className='flex justify-between items-center mt-5'>
                <Label className='text-3xl'>Gate-Pass</Label>
                <Button variant={"outline"} className='cursor-pointer'>
                    <Link to={'/gate-pass/new'}>
                        New Gate-pass
                    </Link>
                </Button>
            </div> */}
            <div className='mt-10'>
                <GatePassIndexForm handleIndexFormSubmit={handleIndexFormSubmit} />
            </div>
            <div className='mt-5'>
                <GatePassTable data={data} />
            </div>
        </div>
    )
}
