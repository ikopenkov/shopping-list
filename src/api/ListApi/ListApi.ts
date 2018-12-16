import { ApiCaller } from 'api/ApiCaller';
import { CreatingList, ListEntry } from 'api/ListApi/ListApiTypes';

export const ListApi = {
  loadItems: async () => {
    const { lists } = <{ lists: ListEntry[] }>await ApiCaller.call({
      url: `/lists/`,
    });

    return lists;
  },

  loadItem: async (id: string) => {
    const { list } = <{ list: ListEntry }>await ApiCaller.call({
      url: `/lists/${id}`,
    });

    return list;
  },

  createItem: async (listFields: CreatingList) => {
    const { list } = <{ list: ListEntry }>await ApiCaller.call({
      url: '/lists/',
      method: 'POST',
      body: listFields,
    });

    return list;
  },

  updateItem: async (id: string, listFields: Partial<CreatingList>) => {
    const { list } = <{ list: ListEntry }>await ApiCaller.call({
      url: `/lists/${id}`,
      method: 'PATCH',
      body: listFields,
    });

    return list;
  },

  deleteItem: async (id: string) => {
    await ApiCaller.call({
      url: `/lists/${id}`,
      method: 'DELETE',
    });
  },
};
