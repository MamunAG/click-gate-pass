import React from 'react'
import { PageAction } from '../../../utility/page-actions';
import { useParams } from 'react-router-dom';
import { useMutation } from 'node_modules/@tanstack/react-query/build/modern/useMutation';

export default function FactoryWiseMenuPermissionForm({
    pageAction
}: {
    pageAction: string;
}) {

    const { FactoryWiseMenuPermissionType } = useParams();




    return (
        <div className='bg-red-700 w-20'>
            rf
        </div>
    )
}
