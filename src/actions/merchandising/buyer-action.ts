import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";
import useAxiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryKey } from "@/utility/react-query-key";

export type BuyerType = {
    Id: number;
    Name: string;
    CountryId: number;
    CountryName?: string;
    Contact?: string;
    Email?: string;
    IsActive: boolean;
    CreatedBy?: string;
    CreatedByUserName?: string;
    CreatedDate?: Date;
    UpdatedBy?: string;
    UpdatedByUserName?: string;
    UpdatedDate?: Date;
};


export async function GetAllBuyer(axios: AxiosInstance): Promise<IApiResponseType<BuyerType[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/buyer`);
    return response.data;
}

export function GetAllActiveBuyer() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<BuyerType[]>> =>
        (await axios.get(`/${companyId}/buyer?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Buyer],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetBuyerById(axios: AxiosInstance, id: number): Promise<IApiResponseType<BuyerType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/buyer/${id}`);
    return response.data;
}

export async function Save(BuyerType: BuyerType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = BuyerType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/buyer`, BuyerType);

    if (!response) {
        throw new Error("This Buyer Type already exist.");
    }

    return response.data;
}

export async function Update(BuyerType: BuyerType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = BuyerType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Buyer name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/buyer/` + BuyerType.Id,
        BuyerType
    );

    if (!response) {
        throw new Error("This buyer already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Buyer not selected.");
    }

    await axios.delete(`/${companyId}/buyer/` + id);
}