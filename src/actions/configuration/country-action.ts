import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export interface ICountry {
    id: number,
    name: string,
    phone_code: string,
    iso_code2: string,
    iso_code3: string,
    region: string,
    is_active: boolean,
};

export async function GetAllCountry(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/country`);
    return response.data;
}

export function GetAllActiveCountry() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<ICountry[]>> =>
        (await axios.get(`/${companyId}/country?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Country],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetCountryById(axios: AxiosInstance, id: number): Promise<IApiResponseType<ICountry>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/country/${id}`);
    return response.data;
}

export async function Save(country: ICountry, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = country;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("country name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/country`, country);

    if (!response) {
        throw new Error("This country already exist.");
    }

    return response.data;
}

export async function Update(country: ICountry, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { name: NAME } = country;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("country name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/country/` + country.id,
        country
    );

    if (!response) {
        throw new Error("This country already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("country not selected.");
    }

    await axios.delete(`/${companyId}/country/` + id);
}