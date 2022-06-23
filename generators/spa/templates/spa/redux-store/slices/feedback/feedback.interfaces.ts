import { Action } from "redux";

export enum AlertTypes {
  Success,
  Info,
  Error,
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
