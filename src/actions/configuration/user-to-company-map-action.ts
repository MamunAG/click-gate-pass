import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { ICompanyType } from "./company-action";
import { IUser } from "./user-action";



export type IUserToCompanyMap = {
    ID: number;
    COMPANY_ID: string;
    COMPANY_NAME?: string;
    USER_ID: string;
    USER?: IUser
};

export async function GetAllCompanyByUser(axios: AxiosInstance, userName: string): Promise<ICompanyType[]> {
    const response = await axios.get(`/UserToCompanyMap/get-all-company-by-user/${userName}`);
    return response.data?.Data;
}

export async function GetAllUserToCompanyMap(axios: AxiosInstance) {

    const response = await axios.get(`/UserToCompanyMap`);
    return response.data;
}

export async function GetUserToCompanyMapById(axios: AxiosInstance, id: string): Promise<IApiResponseType<IUserToCompanyMap>> {
    const response = await axios.get(`/UserToCompanyMap/${id}`);
    return response.data;
}

export async function Save(UserToCompanyMap: IUserToCompanyMap, axios: AxiosInstance) {

    const response = await axios.post("/UserToCompanyMap", UserToCompanyMap);

    if (!response) {
        throw new Error("This user to company map already exist.");
    }

    return response.data;
}

export async function Update(comUserToCompanyMappany: IUserToCompanyMap, axios: AxiosInstance) {



    const response = await axios.put(
        "/UserToCompanyMap" + comUserToCompanyMappany.ID,
        comUserToCompanyMappany
    );

    if (!response) {
        throw new Error("This user to company map already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    if (Number(id) <= 0) {
        throw new Error("Company user to company map selected.");
    }

    await axios.delete("/UserToCompanyMap/" + id);
}