import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export interface ICosting {
    id?: number;
    costing_date: Date;
    costing_no: string;
    total_qty: number;
    buyer_id: number;
    buyer_name?: string | undefined;
    style_id: number;
    style_name?: string | undefined;
    po_id?: number;
    po_no?: string | undefined;
    style_image_url?: string | undefined;
    currency_id: number;
    currency_name?: string | undefined;
    CreatedByUserName?: string | undefined;
    CreatedDate?: Date;
    UpdatedByUserName?: string | undefined;
    UpdatedDate?: Date;
    is_received_by_account?: boolean;
    CostingDetail?: ICostingDetailsDto[];
};


export interface ICostingDetailsDto {
    id?: number;
    costing_wise_cost_id?: number;
    material_id: number;
    materials_name?: string | null | undefined;
    uom_id: number;
    uom_name?: string | null | undefined;
    required_qty_per_pcs_gmt: number;
    required_qty_per_dzn_gmt: number;
    wastage_percentage: number;
    price_per_unit: number;
    price_per_dzn_unit: number;
    total_qty: number;
    total_amount: number;
};

export async function GetNextCostingNo(axios: AxiosInstance): Promise<IApiResponseType<ICosting[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/mer/costing`);
    return response.data;
}

export async function GetAllCosting(axios: AxiosInstance): Promise<IApiResponseType<ICosting[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/mer/costing`);
    return response.data;
}

export async function GetAllCostingByBuyerStyle(axios: AxiosInstance, buyerId: number, styleId: number): Promise<IApiResponseType<ICosting[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/mer/costing?buyerId=${buyerId}&styleId=${styleId}`);
    return response.data;
}

// export async function GetAllActiveCosting(axios: AxiosInstance): Promise<ApiResponseType<ICosting[]>> {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const response = await axios.get(`/${companyId}/mer/costing?IsActive=true`);
//     return response.data;
// }

export async function GetCostingById(axios: AxiosInstance, id: number): Promise<IApiResponseType<ICosting>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/mer/costing/${id}`);
    return response.data;
}

export async function Save(ICosting: ICosting, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { costing_no: NAME } = ICosting;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/mer/costing`, ICosting);

    if (!response) {
        throw new Error("This Costing Type already exist.");
    }

    return response.data;
}

export async function Update(ICosting: ICosting, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { costing_no: NAME } = ICosting;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Costing name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/mer/costing/` + ICosting.id,
        ICosting
    );

    if (!response) {
        throw new Error("This costing already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Costing not selected.");
    }

    await axios.delete(`/${companyId}/mer/costing/` + id);
}


export async function UpdateIsReceived(costingId: number, axios: AxiosInstance): Promise<IApiResponseType<ICosting>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);

    if (costingId <= 0) {
        throw new Error("Please select a costing.");
    }

    const response = await axios.put(
        `/${companyId}/mer/costing/costing-received/` + costingId
    );

    if (!response) {
        throw new Error("This costing already exist.");
    }

    return response.data;
}