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


const companyId = localStorage.getItem(localStorageKey.selectedCompany);


export function GetAllFactoryPermissions() {

    // const axios = useAxiosInstance();

    const getData = async (): Promise<IFactoryPermission[]> => {
        const res = await axios.get("/data/factory-permissions.json");
        return res.data;
    };

    const query = useQuery({
        queryKey: ["FactoryPermissionList"],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}