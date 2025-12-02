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


    // const mutation = useMutation({
    //     mutationFn: (tag: IGatePassSaveDto) => {
    //         if (pageAction === PageAction.add) {
    //             return Save(tag, axios);
    //         } else if (pageAction === PageAction.edit) {
    //             return Update(tag, axios);
    //         } else if (pageAction === PageAction.delete) {
    //             return Delete(tag.id!, axios);
    //         } else {
    //             throw new Error("Page Action no found.");
    //         }
    //     },
    //     onSuccess: () => {
    //         // queryClient.invalidateQueries({
    //         //     queryKey: [ReactQueryKey.AccountGatepass],
    //         // });
    //         navigator(`/Gatepass/${GatepassType}`);
    //     },
    //     onError: (err: AxiosError) => {
    //         console.log('error', err.response?.data);
    //         const res = err.response?.data as IApiResponseType<IGatePassSaveDto>;
    //         // if (res?.IsError) {
    //         //     setErrors(res?.Errors);
    //         // }

    //         toast.error("Message", {
    //             position: "top-center",
    //             description: (
    //                 <pre className="mt-2 w-[300px] rounded-md  p-4 overflow-auto">
    //                     <code className="text-white text-sm">
    //                         {res?.Errors.join("\n")}
    //                     </code>
    //                 </pre>
    //             ),

    //         })
    //     },
    // });


    return (
        <div className='bg-red-700 w-20'>

        </div>
    )
}
