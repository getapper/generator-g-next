import { AlertColor } from "@mui/material";

export interface FeedbackState {
  open: boolean;
  type: AlertColor;
  message: string;
}
