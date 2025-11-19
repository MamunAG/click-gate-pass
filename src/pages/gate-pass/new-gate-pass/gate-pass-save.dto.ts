export type IGatePassSaveDto = {
    date: Date,
    itemTypeId: number,
    gmtTypeId: number,
    gatePassTypeId: number,
    senderName: string,
    carriedBy: string,
    departmentId: number,
    supplierId: number,
    details?: IGatePassDetailsSaveDto[]
}

export type IGatePassDetailsSaveDto = {
    programId: number,
    gmtTypeId: number,
    gatePassTypeId: number,
    senderName: string,
    carriedBy: string,
    departmentId: number,
    supplierId: number,
    details: IGatePassDetailsSaveDto

}