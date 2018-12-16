import { Modules } from 'modules/index';
import { ListModuleState } from 'modules/ListModule/ListModuleTypes';

const INITIAL_STATE: ListModuleState = {
  isLoading: false,
  isLoaded: false,
  hasError: false,
  items: [],
};

const module = Modules.createModule('listModule', INITIAL_STATE);
export const listModule = module;

export interface ListModuleInterface {
  listModule: Partial<ListModuleState>;
}
