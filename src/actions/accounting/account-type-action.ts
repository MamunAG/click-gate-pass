import type { AxiosInstance } from "axios";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type AccountTypeType = {
    Id: number,
    Name: string,
    IsActive: boolean,
    AccountCatagoryId: number,
    AccountCatagoryName: string
};


export async function GetAllAccountType(axios: AxiosInstance): Promise<IApiResponseType<AccountTypeType[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);

    const response = await axios.get(`/${companyId}/accounting/AccountType`);
    return response.data;
}

export async function GetAccountTypeById(axios: AxiosInstance, id: number): Promise<IApiResponseType<AccountTypeType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/AccountType/${id}`);
    return response.data;
}

export async function Save(AccountType: AccountTypeType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/AccountType`, AccountType);

    if (!response) {
        throw new Error("This Account Type already exist.");
    }

    return response.data;
}

export async function Update(AccountType: AccountTypeType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/AccountType/` + AccountType.Id,
        AccountType
    );

    if (!response) {
        throw new Error("This AccountType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Account Type not selected.");
    }

    await axios.delete(`/${companyId}/accounting/AccountType/` + id);
}


export function GetAllAccountTypeCaching() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<AccountTypeType[]>> =>
        (await axios.get(`/${companyId}/accounting/AccountType`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.AccountTypes],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}