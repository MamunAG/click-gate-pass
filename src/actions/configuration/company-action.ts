import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";

export type ICompanyType = {
    Id?: string;
    Name: string;
    ShortName: string;
    Address?: string;
    corporate_address?: string;
    Contact?: string;
    Email?: string;
    Website?: string;
    TINNo?: string;
    IRCNo?: string;
    BINNo?: string;
    VATNo?: string;
    Image?: string;
    CreatedBy?: string;
    CreatedByUserName?: string;
    CreatedDate?: string;
    UpdatedBy?: string;
    UpdatedByUserName?: string;
    UpdatedDate?: string;
};

export function GetAllCompany() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<ICompanyType[]> =>
        ((await axios.get("/Company")).data).Data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Company],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}


export function GetAllActiveCompany() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<ICompanyType[]>> =>
        (await axios.get(`/Company`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.ActiveCompany],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetAllCompanyInfo(axios: AxiosInstance) {

    const response = await axios.get(`/Company`);
    return response.data;
}

export async function GetCompanytById(axios: AxiosInstance, id: string): Promise<IApiResponseType<ICompanyType>> {
    const response = await axios.get(`/Company/${id}`);
    return response.data;
}

export async function Save(Company: ICompanyType, axios: AxiosInstance) {
    const { Name: NAME } = Company;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Company name must be at least 2 character.");
    }

    const response = await axios.post("/Company", Company);

    if (!response) {
        throw new Error("This company already exist.");
    }

    return response.data;
}

export async function Update(company: ICompanyType, axios: AxiosInstance) {
    const { Name: NAME } = company;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Company name must be at least 2 character.");
    }

    const response = await axios.put(
        "/Company/" + company.Id,
        company
    );

    if (!response) {
        throw new Error("This company already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    // if (Number(id) <= 0) {
    //     throw new Error("Company not selected.");
    // }

    await axios.delete("/Company/" + id);
}