import { ModuleInstance } from 'utils/StateHelper';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from 'reducers/rootReducer';
import * as R from 'ramda';

export type ThunkResult<T> = ThunkAction<T, GlobalState, null, Action>;

type ObjectWithStringKeys = { [s: string]: any };

const setItem = <T extends ObjectWithStringKeys>(
  item: T,
  module: ModuleInstance,
  idKey: keyof T = '_id',
): ThunkResult<T[]> => {
  return (dispatch, getState) => {
    const items = <T[]>module.getPart(getState(), 'items');

    const index = items.findIndex(
      iteratingItem => item[idKey] === iteratingItem[idKey],
    );

    if (index == -1) {
      return items.concat(item);
    } else {
      return R.update(index, item, items);
    }
  };
};

const makeSelector = <T>(module: ModuleInstance, part?: string) => {
  return (state: GlobalState) => {
    if (typeof part === 'undefined') {
      return module.getModuleState(state) as T;
    }
    if (typeof part === 'string') {
      return module.getPart(state, part) as T;
    }
  };
};

export const ModuleHelper = {
  setItem,
  makeSelector,
};
