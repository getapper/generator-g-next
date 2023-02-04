import { createSlice } from "@reduxjs/toolkit";
import {
  AjaxState,
} from "./ajax.interfaces";
import * as selectors from "./ajax.selectors";
import * as sagas from "./ajax.sagas";

export interface SetApiLoadingAction {
  payload: {
    api: string;
    isLoading: boolean;
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
