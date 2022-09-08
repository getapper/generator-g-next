import { Action } from "redux";

export enum AlertTypes {
  Success = "success",
  Info = "info",
  Error = "error",
  Warning = "warning",
}

export interface FeedbackState {
  open: boolean;
  type: AlertTypes;
  message: string;
}

export interface SetFeedbackAction extends Action {
  payload: {
    type?: AlertTypes;
    message?: string;
  };
}
