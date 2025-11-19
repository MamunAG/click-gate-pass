import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export interface IStyle {
    Id: number;
    StyleNo: string;
    StyleName: string;
    BuyerId: number;
    BuyerName?: string;
    ItemDescription?: string;
    Fabrication?: string;
    CuttingSMV: number;
    SewingSMV: number;
    FinishingSMV: number;
    ImageUrl?: string;
    IsTopBottomGmt: boolean;
    IsActive: boolean;
};


export async function GetAllStyle(axios: AxiosInstance): Promise<IApiResponseType<IStyle[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/style`);
    return response.data;
}

// export function GetAllActiveStyle() {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const axios = useAxiosInstance();

//     const getData = async (): Promise<ApiResponseType<IStyle[]>> =>
//         (await axios.get(`/${companyId}/style?IsActive=true`)).data;

//     const query = useQuery({
//         queryKey: [ReactQueryKey.Style],
//         queryFn: getData,
//         staleTime: 1000 * 10,
//     });

//     return query;
// }

export async function GetAllActiveStyle(axios: AxiosInstance): Promise<IApiResponseType<IStyle[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/style?IsActive=true`);
    return response.data;
}

export async function GetAllStyleByBuyer(axios: AxiosInstance, buyerId: number): Promise<IApiResponseType<IStyle[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/style/get-style-by-buyer?buyerId=${buyerId}`);
    return response.data;
}

export async function GetStyleById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IStyle>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/style/${id}`);
    return response.data;
}

export async function Save(IStyle: IStyle, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { StyleNo: NAME } = IStyle;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/style`, IStyle);

    if (!response) {
        throw new Error("This Style Type already exist.");
    }

    return response.data;
}

export async function Update(IStyle: IStyle, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { StyleNo: NAME } = IStyle;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Style name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/style/` + IStyle.Id,
        IStyle
    );

    if (!response) {
        throw new Error("This style already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Style not selected.");
    }

    await axios.delete(`/${companyId}/style/` + id);
}