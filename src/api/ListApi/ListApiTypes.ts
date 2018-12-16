import {PurchaseEntry} from "api/PurchaseApi/PurchaseApiTypes";

export type CreatingList = {
    name: string;
};

export type ListEntry = CreatingList & {
    _id: string;
    createdAt: string;
    updatedAt: string;
    purchases: PurchaseEntry[];
}
