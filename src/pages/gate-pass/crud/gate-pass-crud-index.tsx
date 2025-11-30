/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useParams } from 'react-router';
import GatePassForm from './gate-pass-form';
import { PageAction } from '@/utility/page-actions';
import useAxiosInstance from '@/lib/axios-instance';
import React from 'react';
import type { IGatePassSaveDto } from '../dto/gate-pass-save.dto';
import { GetGatePassById } from '../gate-pass.service';
import { useAppStore } from '@/store/app-store';

export default function GatePassCRUD() {
    const setPageTitle = useAppStore((state) => state.setPageName);
    React.useEffect(() => { setPageTitle('Gate-pass') }, [setPageTitle])
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
                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.view} />
                </div>
            </>

        );
    } else if (pageAction === PageAction.add) {
        return (
            <>
                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.add} />
                </div>
            </>
        );
    } else if (pageAction === PageAction.edit) {
        return (
            <>
                <div className="flex flex-col gap-10">
                    <GatePassForm data={voucher} pageAction={PageAction.edit} />
                </div>
            </>


        );
    } else if (pageAction === PageAction.delete) {
        return (
            <>
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
