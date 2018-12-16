import { ApiCaller } from 'api/ApiCaller';
import {
  CreatingPurchase,
  PurchaseEntry,
} from 'api/PurchaseApi/PurchaseApiTypes';

export const PurchaseApi = {
  createItem: async (listId: string, fields: CreatingPurchase) => {
    const { purchase } = <{ purchase: PurchaseEntry }>await ApiCaller.call({
      url: `/lists/${listId}/purchases`,
      method: 'POST',
      body: fields,
    });

    return purchase;
  },

  updateItem: async (
    listId: string,
    purchaseId: string,
    fields: Partial<CreatingPurchase>,
  ) => {
    const { purchase } = <{ purchase: PurchaseEntry }>await ApiCaller.call({
      url: `/lists/${listId}/purchases/${purchaseId}`,
      method: 'PATCH',
      body: fields,
    });

    return purchase;
  },

  deleteItem: async (listId: string, purchaseId: string) => {
    await ApiCaller.call({
      url: `/lists/${listId}/purchases/${purchaseId}`,
      method: 'DELETE',
    });
  },
};
