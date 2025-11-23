import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AjaxState } from "./ajax.interfaces";
import * as selectors from "./ajax.selectors";
import * as sagas from "./ajax.sagas";

const initialState: AjaxState = {
  isLoading: {},
};

export const ajaxStore = createSlice({
  name: "ajax",
  initialState: {
    isLoading: {},
  } as AjaxState,
  reducers: {
    setApiLoading: (
      state,
      {
        payload,
      }: PayloadAction<{
        api: string;
        isLoading: boolean;
      }>,
    ) => {
      state.isLoading[payload.api] = payload.isLoading;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extraActions.clearSession, () => initialState);
  },
});

export { selectors, sagas };
