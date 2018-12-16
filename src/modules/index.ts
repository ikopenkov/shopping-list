import { getStateHelper } from "utils/StateHelper";
import { ListModuleInterface } from "modules/ListModule/ListModule";

export const REDUCER_NAME = "modules";

const { reducer, createModule } = getStateHelper({
  actionPrefix: "MODULES",
  reducerName: REDUCER_NAME
});

export const Modules = {
  reducer,
  createModule,
  REDUCER_NAME
};

interface ModulesState extends ListModuleInterface {}

export interface ModulesStateInterface {
  [REDUCER_NAME]: Partial<ModulesState>;
}
