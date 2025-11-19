import type { AxiosInstance } from "axios";
import type { IApiResponseType } from "../api-response-type";
import { localStorageKey } from "@/lib/auth-provider";

export type IVoucher = {
    Id?: number | undefined;
    VoucherNo: string;
    VoucherDate: Date;
    TransactionTypeId?: number;
    TransactionTypeName?: string | null;
    Amount: number;
    PaymentMethodId?: number | undefined;
    PaymentMethodName?: string | null;
    PaymentTermsId?: number | undefined;
    PaymentTermsName?: string | null;
    TaxPercentage?: number | undefined;
    TaxId?: number | undefined;
    TaxName?: string | null;
    PartyId?: number;
    PartyName?: string | null | undefined;
    ProjectId?: number;
    ProjectName?: string | null | undefined;
    Accounts?: string;
    Description: string;
    ChequeNumber?: string;
    ChequeDate?: Date | null;

    master_lc_id?: number;
    master_lc_number?: string | null | undefined;

    voucher_type_id?: number;
    voucher_type_name?: string | null | undefined;

    bb_lc_no?: string;
    tt_no?: string;

    currency_id?: number;
    currency_name?: string | null | undefined;

    currency_exchange_rate_bdt?: number;

    CompanyId?: string;
    CompanyName?: string;
    CompanyAddress?: string;

    CreatedBy?: string;
    CreatedByUserName?: string;
    CreatedDate?: Date;
    UpdatedBy?: string;
    UpdatedByUserName?: string;
    UpdatedDate?: Date;

    VoucherDetails: VoucherDetailsType[];
};

export type VoucherDetailsType = {
    Id: number;
    VoucherId: number;
    VouchersNo?: string | null | undefined;
    AccountId: number;
    AccountName: string;
    DebitAmount: number;
    CreditAmount: number;
    IsDebitAccount: boolean;
};


export async function GetAllVoucher(axios: AxiosInstance, voucherTypeId: number): Promise<IApiResponseType<IVoucher[]>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/voucher?voucherTypeId=${voucherTypeId}`);
    return response.data;
}

export async function GetVoucherById(axios: AxiosInstance, id: number): Promise<IApiResponseType<IVoucher>> {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const response = await axios.get(`/${companyId}/accounting/voucher/${id}`);
    return response.data;
}

export async function Save(VoucherType: IVoucher, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { VoucherNo: NAME } = VoucherType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.post(`/${companyId}/accounting/Voucher`, VoucherType);

    if (!response) {
        throw new Error("This VoucherType already exist.");
    }

    return response.data;
}

export async function Update(VoucherType: IVoucher, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    const { VoucherNo: NAME } = VoucherType;

    if (!NAME) {
        throw new Error("Name is required");
    }
    if (NAME.length < 2) {
        throw new Error("Voucher name must be at least 2 character.");
    }

    const response = await axios.put(
        `/${companyId}/accounting/Voucher/` + VoucherType.Id,
        VoucherType
    );

    if (!response) {
        throw new Error("This VoucherType already exist.");
    }

    return response.data;
}

export async function Delete(id: number, axios: AxiosInstance) {
    const companyId = localStorage.getItem(localStorageKey.selectedCompany);
    if (Number(id) <= 0) {
        throw new Error("Voucher not selected.");
    }

    await axios.delete(`/${companyId}/accounting/Voucher/` + id);
}