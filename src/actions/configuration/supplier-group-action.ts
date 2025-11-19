import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type SupplierGroupType = {
    Id: number;
    Name: string;
    Remarks?: string;
    IsActive: boolean;
};

export async function GetAllsupplierGroup(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/supplierGroup`);
    return response.data;
}

export function GetAllActivesupplierGroup() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<SupplierGroupType[]>> =>
        (await axios.get(`/${companyId}/supplierGroup?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.SupplierGroup],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetSupplierGroupById(axios: AxiosInstance, id: number): Promise<IApiResponseType<SupplierGroupType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/supplierGroup/${id}`);
    return response.data;
}

export async function Save(supplierGroup: SupplierGroupType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = supplierGroup;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplierGroup name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/supplierGroup`, supplierGroup);

    if (!response) {
        throw new Error("This supplierGroup already exist.");
    }

    return response.data;
}

export async function Update(supplierGroup: SupplierGroupType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = supplierGroup;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplierGroup name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/supplierGroup/` + supplierGroup.Id,
        supplierGroup
    );

    if (!response) {
        throw new Error("This supplierGroup already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("supplierGroup not selected.");
    }

    await axios.delete(`/${companyId}/supplierGroup/` + id);
}