import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import type { AxiosInstance } from "axios";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type Project = {
    Id: number;
    Name: string;
    Code: string;
    Description: string;
    PartyId: number;
    PartyName: string;
    CostBudget: number;
    RevenueBudget: number;
    IsWatchlistOnDashboard: boolean;
    IsActive: boolean;
};

export async function GetAllProject(axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/Project`);
    return response.data;
}

export function GetAllActiveProject() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<Project[]>> =>
        (await axios.get(`/${companyId}/Project?IsActive=true`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.Projects],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetProjectById(axios: AxiosInstance, id: number): Promise<IApiResponseType<Project>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/Project/${id}`);
    return response.data;
}

export async function Save(Project: Project, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = Project;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Project name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/Project`, Project);

    if (!response) {
        throw new Error("This Project already exist.");
    }

    return response.data;
}

export async function Update(Project: Project, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Name: NAME } = Project;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Project name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/Project/` + Project.Id,
        Project
    );

    if (!response) {
        throw new Error("This Project already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Project not selected.");
    }

    await axios.delete(`/${companyId}/Project/` + id);
}