/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useParams } from 'react-router';
import GatePassForm from './gate-pass-form';
import { PageAction } from '@/utility/page-actions';
import useAxiosInstance from '@/lib/axios-instance';
import React from 'react';
import BreadcrumbAddNew from '@/components/Breadcrumbs/Breadcrumb-add-new';
import { AppSheet } from '@/components/AppSheet';
import TaxForm from '@/pages/Tax/Tax-form';
import type { IGatePassSaveDto } from '../dto/gate-pass-save.dto';
import { GetGatePassById } from '../gate-pass.service';
// import AccountForm from '../Account/Account-form';
// import SupplierForm from '@/pages/Configuration/Supplier/Supplier-form';
// import MasterLCForm from '../MasterLC/MasterLC-form';

// function PartyFormSheet() {
//     return (
//         <AppSheet
//             title="New Supplier"
//             btnText='Party'
//             onOpenChange={(er) => console.log(er)}>
//             {/* <SupplierForm data={undefined} pageAction={PageAction.add} isPopup={true} /> */}
//         </AppSheet>
//     )
// }
// function MasterLcFormSheet() {
//     return (
//         <AppSheet
//             title="New Master L/C"
//             btnText='Master L/C'
//             onOpenChange={(er) => console.log(er)}>
//             {/* <MasterLCForm data={undefined} pageAction={PageAction.add} isPopup={true} /> */}
//         </AppSheet>
//     )
// }
function TaxSetupFormSheet() {
    return (
        <AppSheet
            title="New Tax"
            btnText='Tax'
            onOpenChange={(er) => console.log(er)}>
            <TaxForm data={undefined} pageAction={PageAction.add} isPopup={true} />
        </AppSheet>
    )
}

// function ChartOfAccountFormSheet() {
//     return (
//         <AppSheet
//             title="New Chart Of Account"
//             btnText='Account'
//             onOpenChange={(er) => console.log(er)}>
//             {/* <AccountForm data={undefined} pageAction={PageAction.add} isPopup={true} /> */}
//         </AppSheet>
//     )
// }

export default function GatePassCRUD() {
    const axios = useAxiosInstance();
    const [voucher, setVoucher] = React.useState<IGatePassSaveDto | undefined>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const { pageAction, id } = useParams();

    React.useEffect(() => {
        async function getData() {
            try {
                setIsLoading(true);

                await GetGatePassById(axios, Number(id))
                    .then((res) => {
                        if (res.IsError) {
                            console.log("Error found: ", res.Errors);
                            setErrorMsg(JSON.stringify(res.Errors));
                            setVoucher(undefined);
                        } else {
                            setVoucher(res.Data);
                            // console.log('voucher: ', res.Data);
                        }
                    })
                    .catch((m) => console.log(m));
                setIsLoading(false);
            } catch {
                setIsLoading(false);
            }
        }
        getData();

    }, []);


    if (!pageAction) {
        return (
            <Alert variant="destructive">
                <BsExclamationTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Page Action type is required.</AlertDescription>
            </Alert>
        );
    }

    if (errorMsg) {
        return (
            <Alert variant="destructive">
                <BsExclamationTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
        );
    }

    if (isLoading) {
        return (
            <h1>
                <em>Loading...</em>
            </h1>
        );
    }

    if (pageAction === PageAction.view) {
        return (
            <>
                <BreadcrumbAddNew pageName="Voucher" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} >
                </BreadcrumbAddNew>

                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.view} />
                </div>
            </>

        );
    } else if (pageAction === PageAction.add) {
        return (
            <>
                <BreadcrumbAddNew pageName="New Gate-pass" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} >
                    {/* <TransactionTypeFormSheet /> */}
                    {/* <PartyFormSheet />
                    <MasterLcFormSheet /> */}
                    <TaxSetupFormSheet />
                    {/* <ChartOfAccountFormSheet /> */}
                </BreadcrumbAddNew>

                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.add} />
                </div>
            </>
        );
    } else if (pageAction === PageAction.edit) {
        return (
            <>
                <BreadcrumbAddNew pageName="Update Gate-pass" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} >
                    {/* <TransactionTypeFormSheet /> */}
                    {/* <PartyFormSheet />
                    <MasterLcFormSheet /> */}
                    <TaxSetupFormSheet />
                    {/* <ChartOfAccountFormSheet /> */}
                </BreadcrumbAddNew>

                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.edit} />
                </div>
            </>


        );
    } else if (pageAction === PageAction.delete) {
        return (
            <>
                <BreadcrumbAddNew pageName="Delete Gate-pass" isShowAddNewButton={false} handleNavigateToAddNewPage={() => { }} >
                </BreadcrumbAddNew>

                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.delete} />
                </div>
            </>
        );
    } else {
        return (
            <div className="w-full flex flex-col justify-center items-center mt-2 mb-10"></div>
        );
    }

}
