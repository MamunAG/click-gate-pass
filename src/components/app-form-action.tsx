/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSaveButton from './app-save-button';
import AppCancelButton from './app-cancel-button';
import AppBackButton from './app-back-button';
import React from 'react';

type props = {
    pageAction: string,
    mutationIsPending: boolean,
    isLoading: boolean,
    isPopup?: boolean,
    form?: any,
    navigationLink: string,
    children?: React.ReactNode
}

export default function AppFormAction({ pageAction, mutationIsPending, isLoading, isPopup, form, navigationLink, children }: props) {
    return (
        <div className="flex justify-between">
            <AppBackButton mutationIsPending={mutationIsPending} navigationLink={navigationLink} isPopup={isPopup} />
            <div className="flex gap-2">
                {children}
                <AppCancelButton pageAction={pageAction} isPending={mutationIsPending} form={form} />
                <AppSaveButton pageAction={pageAction} mutationIsPending={mutationIsPending} isLoading={isLoading} />
            </div>
        </div>
    )
}
