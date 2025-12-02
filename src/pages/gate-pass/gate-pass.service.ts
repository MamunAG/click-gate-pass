/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosInstance } from "axios";
import { localStorageKey } from "@/lib/auth-provider";
import type { IApiResponseType } from "@/actions/api-response-type";
import type { IGatePassSaveDto } from "./dto/gate-pass-save.dto";
import useAxiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryKey } from "@/utility/react-query-key";

export interface IBuyer {
    Id: number,
    NAME: string
};

export interface IStyle {
    Id: number,
    Styleno: string,
    Stylename: string
};
export interface IPo {
    Id: number,
    Pono: string,
};
export interface IMaterial {
    id: number,
    name: string,
    uom: string,
};



export function GetAllBuyer() {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IBuyer[]> =>
        (await axios.get(`/production/buyer/GetAllBuyer`)).data;
    const query = useQuery({
        queryKey: [ReactQueryKey.Buyer],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export async function GetAllStyleByBuyer(axios: AxiosInstance, buyerId: number): Promise<IStyle[]> {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/production/style/GetAllStyleByBuyer?Buyerid=${buyerId}`);
    return response.data;
}

export async function GetAllPoByStyle(axios: AxiosInstance, styleId: number): Promise<IPo[]> {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/production/PurchaseOrder/GetAllPOByStyle?styleId=${styleId}`);
    return response.data;
}

export function GetAllMaterial() {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<any> =>
        (await axios.get(`/production/material-info/paged?currentPage=1&perPage=10`)).data;
    const query = useQuery({
        queryKey: [ReactQueryKey.Material],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

export function GetAllMaterialWithPagination({ axios, search, currentPage, perPage }: { axios: AxiosInstance, search: string, currentPage: number, perPage: number }) {
    const getData = async (): Promise<any> =>
        (await axios.get(`/production/material-info/paged?currentPage=${currentPage}&perPage=${perPage}&name=${search}`)).data;

    return getData().then((res: any) => {
        console.log('item', res);
        return res.data;
    });
}

export async function GetAllGatePass(axios: AxiosInstance, gatepassTypeId: number): Promise<IApiResponseType<IGatePassSaveDto[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/gatepass?gatepassTypeId=${gatepassTypeId}`);
    return response.data;
}

export async function GetGatePassById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IGatePassSaveDto>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/gatepass/${id}`);
    return response.data;
}

export async function Save(GatePassType: IGatePassSaveDto, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.post(`/${companyId}/accounting/GatePass`, GatePassType);

    if (!response) {
        throw new Error("This GatePassType already exist.");
    }

    return response.data;
}

export async function Update(GatePassType: IGatePassSaveDto, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { sender: NAME } = GatePassType;

    if (!NAME) {
        throw new Error("SupplierName is required");
    }
    if (NAME.length < 2) {
        throw new Error("GatePass name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/GatePass/` + GatePassType.id,
        GatePassType
    );

    if (!response) {
        throw new Error("This GatePassType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("GatePass not selected.");
    }

    await axios.delete(`/${companyId}/accounting/GatePass/` + id);
}