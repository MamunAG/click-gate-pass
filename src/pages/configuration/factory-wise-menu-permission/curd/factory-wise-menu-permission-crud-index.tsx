import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAppStore } from '@/store/app-store';
import { PageAction } from '@/utility/page-actions';
import React, { useEffect, useState } from 'react'
import { BsExclamationTriangle } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import FactoryWiseMenuPermissionForm from './factory-wise-menu-permission-form';

export default function FactoryWiseMenuPermissionCRUD() {

    const setPageTitle = useAppStore((state) => state.setPageName);
    useEffect(() => {
        setPageTitle('Factory Wise Menu Permission')
    }, [setPageTitle])
    const { pageAction, id } = useParams();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


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

    if (pageAction === PageAction.add) {
        return (
            <>
                <div className="flex flex-col gap-10">
                    <FactoryWiseMenuPermissionForm pageAction={PageAction.add} />
                </div>
            </>

        );
    }

    return (
        <div>

        </div>
    )
}
