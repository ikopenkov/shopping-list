import { combineReducers } from 'redux';
import { Modules, ModulesStateInterface } from 'modules/index';

// @ts-ignore
export const rootReducer = combineReducers<GlobalState>({
    [Modules.REDUCER_NAME]: Modules.reducer,
});

export interface GlobalState extends ModulesStateInterface {}
