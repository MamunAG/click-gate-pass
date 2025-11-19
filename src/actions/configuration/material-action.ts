import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type IMaterial = {
    id: number;
    name: string;
    uom_id: number;
    UomName?: string;
    description?: string;
    brand_id: number;
    orgin_id: number;
    material_group_id: number;
    is_active: boolean;
};

export async function GetAllMaterial(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/material`);
    return response.data;
}

export function GetAllActiveMaterial() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<IMaterial[]>> =>
        (await axios.get(`/${companyId}/material?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Material],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetMaterialById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IMaterial>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/material/${id}`);
    return response.data;
}

export async function Save(material: IMaterial, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = material;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("material name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/material`, material);

    if (!response) {
        throw new Error("This material already exist.");
    }

    return response.data;
}

export async function Update(material: IMaterial, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = material;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("material name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/material/` + material.id,
        material
    );

    if (!response) {
        throw new Error("This material already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("material not selected.");
    }

    await axios.delete(`/${companyId}/material/` + id);
}