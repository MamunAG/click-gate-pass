import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";

export type IRoleType = {
    Id: string;
    Name: string;
};

export function GetAllRole() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<IRoleType[]>> =>
        ((await axios.get(`/Role`)).data);

    const query = useQuery({
        queryKey: [ReactQueryKey.Role],
        queryFn: getData,
        staleTime: 1000 * 10 * 60,
    });

    return query;
}

export async function GetAllRoleButSuperAdmin(axios: AxiosInstance): Promise<IApiResponseType<IRoleType[]>> {
    const response = await axios.get(`/Role/Get-All-but-Super-Admin`);
    return response.data;
}

export async function GetRoletById(axios: AxiosInstance, id: string): Promise<IApiResponseType<IRoleType>> {
    const response = await axios.get(`/Role/${id}`);
    return response.data;
}

export async function Save(Role: IRoleType, axios: AxiosInstance) {
    const { Name: NAME } = Role;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Role name must be at least 2 character.");
    }

    const response = await axios.post(`/Role?roleName${Role.Name}`);

    if (!response) {
        throw new Error("This role already exist.");
    }

    return response.data;
}

export async function Update(role: IRoleType, axios: AxiosInstance) {
    const { Name: NAME } = role;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Role name must be at least 2 character.");
    }

    const response = await axios.put(
        `/Role/${role.Id}?roleName=${role.Name}`,
        role
    );

    if (!response) {
        throw new Error("This role already exist.");
    }

    return response.data;
}

export async function Delete(id: string, axios: AxiosInstance) {
    await axios.delete(`/Role/${id}`);
}