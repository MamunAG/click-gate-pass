export type IGatePassSaveDto = {
    id: number,
    gatepassNo: string,
    date: Date,
    itemTypeId: number,
    gmtTypeId: number,
    gatePassTypeId: number,
    senderName: string,
    carriedBy: string,
    departmentId: number,
    supplierName: string,
    supplierId: number,
    details?: IGatePassDetailsSaveDto[]
}

export type IGatePassDetailsSaveDto = {
    buyerId: number,
    styleId: number,
    poId: number,
    programId: number,
    itemId: number,
    colorId: number,
    sizeId: number,
    quantity: number,
    uomId: number,
}