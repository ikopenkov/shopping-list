import {ListEntry} from "api/ListApi/ListApiTypes";

export type ListModuleState = {
    isLoading: boolean;
    isLoaded: boolean;
    hasError: boolean;
    items: ListEntry[];
};
