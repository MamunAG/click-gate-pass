import { localStorageKey } from "@/lib/auth-provider";

export const companyId = localStorage.getItem(localStorageKey.selectedCompany);
