import { localStorageKey } from "@/lib/auth-provider";
import useAxiosInstance from "@/lib/axios-instance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";



export interface IFactoryPermission {
    COMPANY_ID: number;
    FACTORY_NAME: string;
    NO_OF_MODULE: string;
    NO_OF_MENU: string;
    CREATED_BY: string | null;
    UPDATE_BY: string | null;
}

export interface IFactoryType {
    companyTypeId: number;
    companyTypeName: string;
}

export interface ICompany {
    id: number;
    companyId: number;
    name: string;
    companyTypeId: number;
}



export function GetAllFactoryPermissions() {
    const axios = useAxiosInstance();
    const getData = async (): Promise<IFactoryPermission[]> => {
        const res = await axios.get("production/1/FactoryWiseMenuPermission/summary");
        return res.data;
    };
    const query = useQuery({
        queryKey: ["FactoryPermissionList"],
        queryFn: getData,
        staleTime: 1000 * 10,
    });
    return query;
}



export function GetCompaniesByType(companyTypeId: number) {
    const axios = useAxiosInstance();
    const getData = async (): Promise<ICompany[]> => {
        const res = await axios.get(`production/Company/get-by-company-type?companyTypeId=${companyTypeId}`);
        const data: ICompany[] = res.data.map((company: any) => ({
            id: company.ID,
            companyId: company.ID,
            name: company.NAME,
        }));
        return data;
    };
    const query = useQuery({
        queryKey: ["CompaniesByType", companyTypeId],
        queryFn: getData,
        enabled: !!companyTypeId,
        staleTime: 1000 * 10,
    });
    return query;
}


export function GetCompanyTypes(companyId: number) {
    const axios = useAxiosInstance();
    const getData = async (): Promise<IFactoryType[]> => {
        const res = await axios.get(`production/${companyId}/CompanyType`);
        const data: IFactoryType[] = res.data.map((type: any) => ({
            companyTypeId: type.ID,
            companyTypeName: type.TYPE_NAME,
        }));
        return data;
    };
    const query = useQuery({
        queryKey: ["CompanyTypes", companyId],
        queryFn: getData,
        enabled: !!companyId,
        staleTime: 1000 * 10,
    });
    return query;
}