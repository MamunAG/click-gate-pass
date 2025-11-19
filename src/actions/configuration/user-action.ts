// import { localStorageKey } from "@/lib/auth-provider";
import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { IRoleType } from "./role-action";
import { IUserToCompanyMap } from "./user-to-company-map-action";

export type IUser = {
    Id?: string;
    FullName: string;
    Email: string;
    Password?: string;
    PhoneNumber: string;
    Companies: IUserToCompanyMap[];
    Roles: IRoleType[];
    IsActive: boolean;
    BaseUrl?: string;
};


export async function GetAllUser(axios: AxiosInstance): Promise<IApiResponseType<IUser[]>> {
    const response = await axios.get(`/user`);
    return response.data;
}

export async function GetUserById(axios: AxiosInstance, id: string): Promise<IApiResponseType<IUser>> {
    const response = await axios.get(`/user/GetById/${id}`);
    return response.data;
}

export async function GetUserByEmail(axios: AxiosInstance, email: string): Promise<IApiResponseType<IUser>> {
    const response = await axios.get(`/user/GetByEmail/${email}`);
    return response.data;
}

export async function Save(user: IUser, axios: AxiosInstance) {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { Email } = user;

    if (!Email) {
        throw new Error("Name is required");
    }
    if (Email.length < 2) {
        throw new Error("user name must be at least 2 character.");
    }

    const response = await axios.post(`/user/user-register-save`, user);

    if (!response) {
        throw new Error("This user already exist.");
    }

    return response.data;
}

export async function Update(user: IUser, axios: AxiosInstance) {
    const { Email } = user;

    if (!Email) {
        throw new Error("Name is required");
    }
    if (Email.length < 2) {
        throw new Error("user name must be at least 2 character.");
    }

    const response = await axios.put(
        `/user/user-register-update`,
        user
    );

    if (!response) {
        throw new Error("This user already exist.");
    }

    return response.data;
}

export async function Delete(email: string, axios: AxiosInstance) {
    await axios.delete(`/user/${email}`);
}