import React, { useState } from 'react'
import { PageAction } from '../../../utility/page-actions';
import { useNavigate, useParams } from 'react-router-dom';
import AppPageContainer from '@/components/AppPageContainerProps';
import AppFormAction from '@/components/app-form-action';
import { IGatePassSaveDto } from '@/pages/gate-pass/dto/gate-pass-save.dto';
import { Delete, Save, Update } from '@/pages/gate-pass/gate-pass.service';
import axios, { AxiosError } from 'axios';
import { IApiResponseType } from '@/actions/api-response-type';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export default function FactoryWiseMenuPermissionForm({
    pageAction
}: {
    pageAction: string;
}) {

    const { GatepassType } = useParams();
    console.log('GatepassType', GatepassType);
    const navigator = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);




    return (
        <div className=''>
            <AppPageContainer>
            </AppPageContainer>
        </div>
    )
}
