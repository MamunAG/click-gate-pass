import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export interface ICurrency {
    id: number;
    name: string;
    code: string;
    rate: number;
    symbol: string;
    is_default: string;
    is_active: boolean;
};

export async function GetAllcurrency(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/currency`);
    return response.data;
}

export function GetAllActivecurrency() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<ICurrency[]>> =>
        (await axios.get(`/${companyId}/currency?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Currency],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetCurrencyById(axios: AxiosInstance, id: number): Promise<IApiResponseType<ICurrency>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/currency/${id}`);
    return response.data;
}

export async function Save(currency: ICurrency, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = currency;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("currency name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/currency`, currency);

    if (!response) {
        throw new Error("This currency already exist.");
    }

    return response.data;
}

export async function Update(currency: ICurrency, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = currency;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("currency name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/currency/` + currency.id,
        currency
    );

    if (!response) {
        throw new Error("This currency already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("currency not selected.");
    }

    await axios.delete(`/${companyId}/currency/` + id);
}