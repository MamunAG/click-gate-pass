import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type PaymentMethod = {
    Id: number;
    Name: string;
    IsActive: boolean;
};

export async function GetAllPaymentMethod(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/PaymentMethod`);
    return response.data;
}

export function GetAllActivePaymentMethod() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<PaymentMethod[]>> =>
        (await axios.get(`/${companyId}/PaymentMethod?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.PaymentMethods],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<IApiResponseType<PaymentMethod>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/PaymentMethod/${id}`);
    return response.data;
}

// export async function Save(PaymentMethod: PaymentMethod, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = PaymentMethod;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentMethod name must be at least 2 character.");
//     }

//     const response = await axios.post(`/${companyId}/PaymentMethod`, PaymentMethod);

//     if (!response) {
//         throw new Error("This PaymentMethod already exist.");
//     }

//     return response.data;
// }

// export async function Update(PaymentMethod: PaymentMethod, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { Name: NAME } = PaymentMethod;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("PaymentMethod name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         `/${companyId}/PaymentMethod/` + PaymentMethod.Id,
//         PaymentMethod
//     );

//     if (!response) {
//         throw new Error("This PaymentMethod already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
// const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     if (Number(id) <= 0) {
//         throw new Error("PaymentMethod not selected.");
//     }

//     await axios.delete(`/${companyId}/PaymentMethod/` + id);
// }