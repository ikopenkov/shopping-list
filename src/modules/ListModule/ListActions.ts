import { ThunkResult, ModuleHelper } from 'utils/ModuleHelper';
import { CreatingList, ListEntry } from 'api/ListApi/ListApiTypes';
import { CreatingPurchase } from 'api/PurchaseApi/PurchaseApiTypes';
import { ListApi } from 'api/ListApi/ListApi';
import { PurchaseApi } from 'api/PurchaseApi/PurchaseApi';
import { ListSelectors } from 'modules/ListModule/ListSelectors';
import * as R from 'ramda';
import { listModule as module } from 'modules/ListModule/ListModule';

const createItem = (
  list: CreatingList,
  purchases: CreatingPurchase[] = [],
): ThunkResult<Promise<ListEntry>> => async (dispatch, getState) => {
  const listEntry = await ListApi.createItem(list);

  const purchaseEntries = await Promise.all(
    purchases.map(purchase => PurchaseApi.createItem(listEntry._id, purchase)),
  );

  listEntry.purchases = purchaseEntries;

  dispatch(_setItem(listEntry));

  const items = dispatch(ModuleHelper.setItem(listEntry, module));

  dispatch(module.setModuleState({ items }));

  return listEntry;
};

const deleteItem = (id: string): ThunkResult<Promise<void>> => async (
  dispatch,
  getState,
) => {
  await ListApi.deleteItem(id);

  let items = ListSelectors.getItems(getState());
  items = R.reject(R.propEq('_id', id), items);

  dispatch(module.setModuleState({ items }));
};

const loadItems = (): ThunkResult<Promise<ListEntry[]>> => async (
  dispatch,
  getState,
) => {
  module.setModuleState({ isLoading: true });

  let items;
  try {
    items = await ListApi.loadItems();
  } catch (error) {
    console.error('failed to load lists', error);
    dispatch(
      module.setModuleState({
        isLoading: false,
        hasError: true,
      }),
    );

    throw error;
  }

  dispatch(
    module.setModuleState({
      hasError: false,
      isLoaded: true,
      isLoading: false,
      items,
    }),
  );

  return items;
};

const loadItem = (id: string): ThunkResult<Promise<ListEntry>> => async (
  dispatch,
  getState,
) => {
  const item = await ListApi.loadItem(id);

  dispatch(_setItem(item));

  return item;
};

const updateItem = (id: string, updatingList: Partial<CreatingList>): ThunkResult<Promise<ListEntry>> => async (
  dispatch,
  getState,
) => {
  const item = await ListApi.updateItem(id, updatingList);
  console.log(item);
  dispatch(_setItem(item));

  return item;
};

const _setItem = (
  item: ListEntry,
): ThunkResult<ListEntry[]> => (dispatch, getState) => {
  const items = <ListEntry[]>dispatch(ModuleHelper.setItem(item, module));

  dispatch(
    module.setModuleState({
      items,
    }),
  );

  return items;
};

const createPurchase = (
  listId: string,
  purchase: CreatingPurchase,
): ThunkResult<Promise<ListEntry>> => async (dispatch, getState) => {
  const purchaseEntry = await PurchaseApi.createItem(listId, purchase);

  const item = ListSelectors.getItem(getState(), listId);
  item.purchases = item.purchases.concat(purchaseEntry);
  dispatch(_setItem(item));

  return item;
};

const updatePurchase = (
  listId: string,
  purchaseId: string,
  purchase: Partial<CreatingPurchase>,
): ThunkResult<Promise<ListEntry>> => async (dispatch, getState) => {
  const purchaseEntry = await PurchaseApi.updateItem(
    listId,
    purchaseId,
    purchase,
  );

  const item = ListSelectors.getItem(getState(), listId);

  const index = item.purchases.findIndex(R.propEq('_id', purchaseId));

  item.purchases = R.update(index, purchaseEntry, item.purchases);

  dispatch(_setItem(item));

  return item;
};

const deletePurchase = (
  listId: string,
  purchaseId: string,
): ThunkResult<Promise<ListEntry>> => async (dispatch, getState) => {
  await PurchaseApi.deleteItem(listId, purchaseId);

  const item = ListSelectors.getItem(getState(), listId);

  item.purchases = R.reject(R.propEq('_id', purchaseId), item.purchases);

  dispatch(_setItem(item));

  return item;
};

export const ListActions = {
  createItem,
  updateItem,
  deleteItem,
  loadItems,
  loadItem,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
