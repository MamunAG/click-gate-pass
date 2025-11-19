import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type TransactionType = {
    Id: number;
    Name: string;
    Description?: string | undefined;
    IsActive: boolean;
    TransactionTypeDetails: TransactionTypeDetailsType[];
};

export type TransactionTypeDetailsType = {
    Id: number;
    TransactionTypeId: number;
    TransactionTypeName?: string | null | undefined;
    AccountId: number;
    AccountName: string;
    IsDebitAccount: boolean;
};

export async function GetAllTransactionType(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/TransactionType`);
    return response.data;
}

export function GetAllActiveTransactionType() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<TransactionType[]>> =>
        (await axios.get(`/${companyId}/accounting/TransactionType?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.TransactionTypes],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTransactionById(axios: AxiosInstance, id: number): Promise<IApiResponseType<TransactionType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/TransactionType/${id}`);
    return response.data;
}

export async function Save(TransactionType: TransactionType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = TransactionType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("TransactionType name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/TransactionType`, TransactionType);

    if (!response) {
        throw new Error("This TransactionType already exist.");
    }

    return response.data;
}

export async function Update(TransactionType: TransactionType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = TransactionType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("TransactionType name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/TransactionType/` + TransactionType.Id,
        TransactionType
    );

    if (!response) {
        throw new Error("This TransactionType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("TransactionType not selected.");
    }

    await axios.delete(`/${companyId}/accounting/TransactionType/` + id);
}