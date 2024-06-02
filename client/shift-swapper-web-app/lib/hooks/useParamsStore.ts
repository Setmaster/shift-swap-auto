import {create} from "zustand";
import {createWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";

type State = {
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    searchValue: string;
}

type Actions = {
    setParams: (params: Partial<State>) => void;
    resetParams: () => void;
    setSearchValue: (value: string) => void;
}

const initialState: State = {
    pageNumber: 1,
    pageSize: 16,
    pageCount: 1,
    searchTerm: '',
    searchValue: '',
};

export const useParamsStore = createWithEqualityFn<State & Actions>((set) => ({
    ...initialState,
    setParams: (params) => {
        set((state) => {
            if (params.pageNumber) {
                return {
                    ...state,
                    pageNumber: params.pageNumber,
                };
            } else {
                return {
                    ...state,
                    ...params,
                    pageNumber: 1,
                };
            }
        });
    },

    resetParams: () => set(initialState),
    setSearchValue: (value) => set({searchValue: value}),
}), shallow);