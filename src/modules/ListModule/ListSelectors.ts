import { GlobalState } from 'reducers/rootReducer';
import { listModule } from 'modules/ListModule/ListModule';
import { ListEntry } from 'api/ListApi/ListApiTypes';
import * as R from 'ramda';
import { ModuleHelper } from 'utils/ModuleHelper';
import { ListModuleState } from 'modules/ListModule/ListModuleTypes';
import * as moment from 'moment';
import { GetFunctionResult } from 'utils/ReduxUtils';
import { PurchaseEntry } from 'api/PurchaseApi/PurchaseApiTypes';

const getModuleState = ModuleHelper.makeSelector<ListModuleState>(listModule);

const getIsLoaded = ModuleHelper.makeSelector<boolean>(listModule, 'isLoaded');
const getIsLoading = ModuleHelper.makeSelector<boolean>(
  listModule,
  'isLoading',
);
const getHasError = ModuleHelper.makeSelector<boolean>(listModule, 'hasError');
const getItems = ModuleHelper.makeSelector<ListEntry[]>(listModule, 'items');
const getItem = (state: GlobalState, id: string) =>
  R.pipe(
    getItems,
    R.find<ListEntry>(R.propEq('_id', id)),
  )(state);

const getItemExtended = R.pipe(
  getItem,
  item => {
    return (
      item && {
        ...item,
        customFields: {
          createdAtMoment: moment(item.createdAt),
          updatedAtMoment: moment(item.updatedAt),
        },
      }
    );
  },
);

export type ListExtended = GetFunctionResult<typeof getItemExtended>;

const getItemsExtended = (state: GlobalState) =>
  R.pipe(
    getItems,
    R.map(item => getItemExtended(state, item._id)),
  )(state);

const getItemsExtendedSorted = R.pipe(
  getItemsExtended,
  R.sortBy(R.prop('updatedAt')),
);

const getPurchase = (state: GlobalState, listId: string, purchaseId: string) =>
  R.pipe(
    getItemExtended,
    R.prop('purchases'),
    R.find<PurchaseEntry>(R.propEq('_id', purchaseId)),
  )(state, listId);

export const ListSelectors = {
  getModuleState,

  getItems,
  getItem,
  getIsLoaded,
  getIsLoading,
  getHasError,

  getItemExtended,
  getItemsExtended,
  getItemsExtendedSorted,

  getPurchase,
};
