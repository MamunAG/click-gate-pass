import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type PaymentTerms = {
    Id: number;
    Name: string;
    Days: number;
    IsActive: boolean;
};

export async function GetAllPaymentTerms(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/PaymentTerms`);
    return response.data;
}

export function GetAllActivePaymentTerms() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<PaymentTerms[]>> =>
        (await axios.get(`/${companyId}/PaymentTerms?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.PaymentTerms],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<IApiResponseType<PaymentTerms>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/PaymentTerms/${id}`);
    return response.data;
}

// export async function Save(PaymentTerms: PaymentTerms, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = PaymentTerms;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentTerms name must be at least 2 character.");
//     }

//     const response = await axios.post(`/${companyId}/PaymentTerms`, PaymentTerms);

//     if (!response) {
//         throw new Error("This PaymentTerms already exist.");
//     }

//     return response.data;
// }

// export async function Update(PaymentTerms: PaymentTerms, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = PaymentTerms;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentTerms name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         `/${companyId}/PaymentTerms/` + PaymentTerms.Id,
//         PaymentTerms
//     );

//     if (!response) {
//         throw new Error("This PaymentTerms already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     if (Number(id) <= 0) {
//         throw new Error("PaymentTerms not selected.");
//     }

//     await axios.delete(`/${companyId}/PaymentTerms/` + id);
// }