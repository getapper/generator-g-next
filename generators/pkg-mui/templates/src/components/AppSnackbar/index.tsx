import React, { memo } from "react";
import {
  Snackbar,
  SnackbarOrigin,
  Alert,
  AlertTitle,
  AlertColor,
} from "@mui/material";

const anchorOrigin: SnackbarOrigin = {
  vertical: "top",
  horizontal: "center",
};

type AppSnackbarProps = {
  open: boolean;
  severity: AlertColor;
  message: string;
  onClose: () => void;
};

export const AppSnackbar = memo(
  ({ open, message, severity, onClose }: AppSnackbarProps) => {
    return (
      <Snackbar open={open} anchorOrigin={anchorOrigin}>
        <Alert severity={severity} onClose={onClose}>
          <AlertTitle>
            {{
              success: "Success",
              error: "Error",
              info: "Info",
              warning: "Warning",
            }[severity] ?? ""}
          </AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    );
  },
);
AppSnackbar.displayName = "AppSnackbar";
