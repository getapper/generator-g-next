import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackState } from "./feedback.interfaces";
import * as selectors from "./feedback.selectors";
import * as sagas from "./feedback.sagas";
import { AlertColor } from "@mui/material";

const initialState: FeedbackState = {
  open: false,
  type: "info",
  message: "",
};

export const feedbackStore = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedback: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: AlertColor;
        message?: string;
      }>,
    ) => {
      state.open = true;
      state.type = payload.type ?? "info";
      state.message = payload.message ?? state.message;
    },
    closeFeedback: (state) => {
      state.open = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extraActions.clearSession, () => initialState);
  },
});

export { selectors, sagas };
