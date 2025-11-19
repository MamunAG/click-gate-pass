import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type IUom = {
    id: number;
    name: string;
    description: string;
    is_active: boolean;
};

export async function GetAllUom(axios: AxiosInstance): Promise<IApiResponseType<IUom[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/uom`);
    return response.data;
}

export function GetAllActiveuom() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<IUom[]>> =>
        (await axios.get(`/${companyId}/uom?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Uom],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetUomById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IUom>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/uom/${id}`);
    return response.data;
}

export async function Save(uom: IUom, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = uom;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("uom name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/uom`, uom);

    if (!response) {
        throw new Error("This uom already exist.");
    }

    return response.data;
}

export async function Update(uom: IUom, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = uom;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("uom name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/uom/` + uom.id,
        uom
    );

    if (!response) {
        throw new Error("This uom already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("uom not selected.");
    }

    await axios.delete(`/${companyId}/uom/` + id);
}