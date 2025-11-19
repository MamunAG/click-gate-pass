import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";
import useAxiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryKey } from "@/utility/react-query-key";

export type TaxType = {
    Id: number,
    Name: string,
    Percentage: number,
    IsActive: boolean,

};


export async function GetAllTax(axios: AxiosInstance): Promise<IApiResponseType<TaxType[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/TaxSetup`);
    return response.data;
}
export function GetAllActiveTax() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<TaxType[]>> =>
        (await axios.get(`/${companyId}/accounting/TaxSetup?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Taxs],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetTaxById(axios: AxiosInstance, id: number): Promise<IApiResponseType<TaxType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/TaxSetup/${id}`);
    return response.data;
}

export async function Save(tax: TaxType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = tax;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/TaxSetup`, tax);

    if (!response) {
        throw new Error("This Account Type already exist.");
    }

    return response.data;
}

export async function Update(tax: TaxType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = tax;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Account name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/TaxSetup/` + tax.Id,
        tax
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

    await axios.delete(`/${companyId}/accounting/TaxSetup/` + id);
}