import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";
import useAxiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryKey } from "@/utility/react-query-key";

export type ChartOfAccountType = {
    Id: number,
    Name: string,
    AccountTypeId: number,
    AccountTypeName: string,
    CashFlowCatagoryId: number,
    CashFlowCategoryName: string,
    Description?: string,
    BankAccountNo?: string,
    IsActive: boolean,
    IsShowInDashboard: boolean
};


export async function GetAllAccount(axios: AxiosInstance): Promise<IApiResponseType<ChartOfAccountType[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/ChartOfAccount`);
    return response.data;
}

export function GetAllActiveChartOfAccount() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<ChartOfAccountType[]>> =>
        (await axios.get(`/${companyId}/accounting/ChartOfAccount?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.ChartOfAccounts],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetAccountById(axios: AxiosInstance, id: number): Promise<IApiResponseType<ChartOfAccountType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/ChartOfAccount/${id}`);
    return response.data;
}

export async function Save(AccountType: ChartOfAccountType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/ChartOfAccount`, AccountType);

    if (!response) {
        throw new Error("This Account Type already exist.");
    }

    return response.data;
}

export async function Update(AccountType: ChartOfAccountType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = AccountType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Account name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/ChartOfAccount/` + AccountType.Id,
        AccountType
    );

    if (!response) {
        throw new Error("This account already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Account not selected.");
    }

    await axios.delete(`/${companyId}/accounting/ChartOfAccount/` + id);
}