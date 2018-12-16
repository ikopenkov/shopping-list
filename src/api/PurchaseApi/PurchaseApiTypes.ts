export type CreatingPurchase = {
    name: string;
    bought?: boolean;
    number?: number;
};

export type PurchaseEntry = CreatingPurchase &{
    _id: string;
    createdAt: string;
    updatedAt: string;
    list: string;
};
