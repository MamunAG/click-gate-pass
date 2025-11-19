import useAxiosInstance from "@/lib/axios-instance";
import { ReactQueryKey } from "@/utility/react-query-key";
import { useQuery } from "@tanstack/react-query";

export interface IGmtType {
    id: number,
    name: string
};

// export async function GetAllDepartment(axios: AxiosInstance) {
//     // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const response = await axios.get(`/production/gatepass/get-all-department`);
//     return response.data;
// }
export function GetAllDepartment() {
    // const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const axios = useAxiosInstance();

    const getData = async (): Promise<IGmtType[]> =>
        (await axios.get(`/production/gatepass/get-all-department`)).data;
    const query = useQuery({
        queryKey: [ReactQueryKey.GatepassDept],
        queryFn: getData,
        staleTime: 1000 * 10,
    });

    return query;
}

// export function GetAllActiveCountry() {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const axios = useAxiosInstance();

//     const getData = async (): Promise<IApiResponseType<IGmtType[]>> =>
//         (await axios.get(`/${companyId}/country?IsActive=true`)).data;

//     const query = useQuery({
//         queryKey: [ReactQueryKey.Country],
//         queryFn: getData,
//         staleTime: 1000 * 10,
//     });

//     return query;
// }

// export async function GetCountryById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IGmtType>> {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const response = await axios.get(`/${companyId}/country/${id}`);
//     return response.data;
// }

// export async function Save(country: IGmtType, axios: AxiosInstance) {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { name: NAME } = country;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("country name must be at least 2 character.");
//     }

//     const response = await axios.post(`/${companyId}/country`, country);

//     if (!response) {
//         throw new Error("This country already exist.");
//     }

//     return response.data;
// }

// export async function Update(country: IGmtType, axios: AxiosInstance) {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     const { name: NAME } = country;

//     if (!NAME) {
//         throw new Error("Name is required");
//     }
//     if (NAME.length < 2) {
//         throw new Error("country name must be at least 2 character.");
//     }

//     const response = await axios.put(
//         `/${companyId}/country/` + country.id,
//         country
//     );

//     if (!response) {
//         throw new Error("This country already exist.");
//     }

//     return response.data;
// }

// export async function Delete(id: number, axios: AxiosInstance) {
//     const companyId = localStorage.getItem(localStorageKey.selectedCompany);
//     if (Number(id) <= 0) {
//         throw new Error("country not selected.");
//     }

//     await axios.delete(`/${companyId}/country/` + id);
// }