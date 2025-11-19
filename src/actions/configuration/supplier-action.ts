import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type SupplierType = {
    Id: number;
    Name: string;
    Contactperson?: string;
    Mobile?: string;
    Phone?: string;
    Address?: string;
    Email?: string;
    Web?: string;
    ChequeBook?: string;
    BankAccountNo?: string;
    Isactive: boolean;
    lstSupplierToGroupMap?: SupplierToGroupMap[];
};
export type SupplierToGroupMap = {
    Id: number;
    SupplierId: number;
    SupplierName?: string;
    SupplierGroupId: number;
    SupplierGroupName?: string;
};

export async function GetAllsupplier(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);

    const response = await axios.get(`/${companyId}/supplier`);
    return response.data;
}

export function GetAllActivesupplier() {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<SupplierType[]> =>
        (await axios.get(`/production/Supplier/GetAllSupplier`)).data;
    const query = useQuery({
        queryKey: [ReactQueryKey.Supplier],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetSupplierById(axios: AxiosInstance, id: number): Promise<IApiResponseType<SupplierType>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/supplier/${id}`);
    return response.data;
}

export async function Save(supplier: SupplierType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = supplier;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplier name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/supplier`, supplier);

    if (!response) {
        throw new Error("This supplier already exist.");
    }

    return response.data;
}

export async function Update(supplier: SupplierType, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = supplier;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("supplier name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/supplier/` + supplier.Id,
        supplier
    );

    if (!response) {
        throw new Error("This supplier already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Supplier not selected.");
    }

    await axios.delete(`/${companyId}/supplier/` + id);
}