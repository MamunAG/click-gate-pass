import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type AccountCategoryType = {
    Id: number;
    Name: string;
};


export function GetAllAccountCategory() {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);

    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<AccountCategoryType[]>> =>
        (await axios.get(`/${companyId}/accounting/AccountCatagory`)).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.AccountCategories],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}