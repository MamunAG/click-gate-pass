import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import type { IApiResponseType } from "../api-response-type";

export type CashFlowCategoryType = {
    Id: number;
    Name: string;
};


export function GetAllCashFlowCategory() {
    const axios = useAxiosInstance();

    const getData = async (): Promise<IApiResponseType<CashFlowCategoryType[]>> =>
        (await axios.get("/169d74c5-deaf-4b49-de77-08dd8f61bf1f/accounting/CashFlowCategory")).data;

    const query = useQuery({
        queryKey: [ReactQueryKey.CashFlowCategories],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}