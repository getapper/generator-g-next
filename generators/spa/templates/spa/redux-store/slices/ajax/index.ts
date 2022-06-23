import { createSlice } from "@reduxjs/toolkit";
import * as selectors from "./ajax.selectors";
import * as sagas from "./ajax.sagas";

export interface SetApiLoadingAction {
  payload: {
    api: string;
    isLoading: boolean;
  };
}

interface AjaxState {
  isLoading: {
    [key: string]: boolean;
  };
}

export const ajaxStore = createSlice({
  name: "ajax",
  initialState: {
    isLoading: {},
  } as AjaxState,
  reducers: {
    setApiLoading: (state, { payload }: SetApiLoadingAction) => {
      state.isLoading[payload.api] = payload.isLoading;
    },
  },
});

export { selectors, sagas };
