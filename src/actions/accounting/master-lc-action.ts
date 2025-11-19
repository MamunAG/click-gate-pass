import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type IMasterLC = {
    id: number;
    buyer_id: number;
    buyer_name?: string;
    master_lc_no: string;
    description?: string;
    total_value: number;
    currency_id: number;
    currency_name?: string;
    is_active: boolean;
    is_add_to_dashboard: boolean;
    masterLCDetails: IMasterLCDetailsType[];
};

export type IMasterLCDetailsType = {
    id: number;
    master_lc_id: number;
    master_lc_number?: string;
    style_id: number;
    style_name?: string;
};

export async function GetAllMasterLC(axios: AxiosInstance): Promise<IApiResponseType<IMasterLC[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/MasterLC`);
    return response.data;
}

export function GetAllActiveMasterLC() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<IMasterLC[]>> =>
        (await axios.get(`/${companyId}/accounting/MasterLC?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.MasterLC],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetMasterLcById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IMasterLC>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/MasterLC/${id}`);
    return response.data;
}

export async function Save(MasterLC: IMasterLC, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { master_lc_no: NAME } = MasterLC;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("MasterLC name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/MasterLC`, MasterLC);

    if (!response) {
        throw new Error("This MasterLC already exist.");
    }

    return response.data;
}

export async function Update(MasterLC: IMasterLC, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { master_lc_no: NAME } = MasterLC;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("MasterLC name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/MasterLC/` + MasterLC.id,
        MasterLC
    );

    if (!response) {
        throw new Error("This MasterLC already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("MasterLC not selected.");
    }

    await axios.delete(`/${companyId}/accounting/MasterLC/` + id);
}