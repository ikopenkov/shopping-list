import { GlobalState } from 'reducers/rootReducer';
import { DataUtils } from 'utils/DataUtils';
import * as R from 'ramda';
import { Types } from 'utils/Types';

interface Action<State> {
  type: string;
  payload: {
    moduleName: string;
    moduleState?: State;
    initialState?: State;
    partName?: string;
    partData?: any; // TODO: remove any
  };
}

const createReducer = <StateGeneric extends Types.StringMap>(
  actionPrefix: string,
) => {
  return (state: StateGeneric, action: Action<StateGeneric>) => {
    if (action && action.type.indexOf(actionPrefix) === 0) {
      const {
        payload: { moduleName, moduleState, initialState, partName, partData },
      } = action;

      if (moduleState) {
        // used Object.assign in place of spread because TS bug not fixed yet https://github.com/Microsoft/TypeScript/issues/14409
        return Object.assign({}, state, {
          [moduleName]: Object.assign(
            {},
            state[moduleName] || initialState,
            Object.assign({}, moduleState),
          ),
        });
      }

      return Object.assign({}, state, {
        [moduleName]: Object.assign({}, state[moduleName] || initialState, {
          [partName]: partData,
        }),
      });
    }

    return state || {};
  };
};

interface ConstructorParams<StateGeneric extends Types.StringMap>
  extends HelperCreatorParams {
  name: string;
  initialState: StateGeneric;
}

class Module<
  StateGeneric extends Types.StringMap,
  GlobalStateGeneric extends Types.StringMap
> {
  _moduleName: string;
  _initialState: StateGeneric;
  _reducerName: string;
  _actionPrefix: string;

  constructor({
    name,
    initialState,
    reducerName,
    actionPrefix,
  }: ConstructorParams<StateGeneric>) {
    this._moduleName = name;
    this._initialState = initialState;
    this._reducerName = reducerName;
    this._actionPrefix = actionPrefix;
  }

  setPart(name: string, data: any) {
    return {
      type: `${this._actionPrefix}_${this._moduleName}_${name}`, // data after prefix in not important, just for better debugging
      payload: {
        moduleName: this._moduleName,
        initialState: this._initialState,
        partName: name,
        partData: data,
      },
    };
  }

  getPart<T>(state: GlobalStateGeneric, name: string) {
    const globalState = this.getModuleState(state);
    const moduleState: T = globalState[name];
    return DataUtils.cloneNotDeep(moduleState);
  }

  setModuleState(state: Partial<StateGeneric>) {
    return {
      type: `${this._actionPrefix}_${this._moduleName}`,
      payload: {
        moduleName: this._moduleName,
        moduleState: state,
      },
    };
  }

  getModuleState(globalState: GlobalStateGeneric): StateGeneric {
    return Object.assign(
      {},
      this._initialState,
      R.pathOr({}, [this._reducerName, this._moduleName], globalState),
    );
  }
}

interface HelperCreatorParams {
  actionPrefix: string;
  reducerName: string;
}

export const getStateHelper = <GlobalStateGeneric>({
  actionPrefix,
  reducerName,
}: HelperCreatorParams) => ({
  createModule<StateGeneric>(name: string, initialState: StateGeneric) {
    return new Module({ name, initialState, reducerName, actionPrefix });
  },

  reducer: createReducer(actionPrefix),
});

export type ModuleInstance = {
  setPart: (name: string, data: any) => Action<any>;
  getPart: <T>(state: GlobalState, name: string) => T;
  setModuleState: (state: any) => Action<any>;
  getModuleState: (globalState: any) => any;
};
