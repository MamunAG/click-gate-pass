import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type IVoucherType = {
    Id: number;
    Name: string;
    IsActive: boolean;
};

export async function GetAllIVoucherType(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/VoucherType`);
    return response.data;
}

export function GetAllActiveIVoucherType() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<IVoucherType[]>> =>
        (await axios.get(`/${companyId}/VoucherType?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.VoucherTypes],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IVoucherType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/VoucherType/${id}`);
    return response.data;
}

// export async function Save(IVoucherType: IVoucherType, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = IVoucherType;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("IVoucherType name must be at least 2 character.");
//     }

//     const response = await axios.post(`/${companyId}/VoucherType`, IVoucherType);

//     if (!response) {
//         throw new Error("This IVoucherType already exist.");
//     }

//     return response.data;
// }

// export async function Update(IVoucherType: IVoucherType, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = IVoucherType;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("IVoucherType name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         `/${companyId}/VoucherType/` + IVoucherType.Id,
//         IVoucherType
//     );

//     if (!response) {
//         throw new Error("This IVoucherType already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     if (Number(id) <= 0) {
//         throw new Error("IVoucherType not selected.");
//     }

//     await axios.delete(`/${companyId}/VoucherType/` + id);
// }