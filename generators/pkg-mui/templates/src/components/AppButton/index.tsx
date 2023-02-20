import React, { memo } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

export type AppButtonProps = {
  loading?: boolean;
} & ButtonProps;

export const AppButton = memo(
  ({ loading = false, ...props }: AppButtonProps) => {
    if (loading) {
      return (
        <Button {...props}>
          <CircularProgress
            color={
              (props.color ?? "primary") === "primary" ? "secondary" : "primary"
            }
            size={24}
          />
        </Button>
      );
    }

    return <Button {...props} />;
  },
);
AppButton.displayName = "AppButton";
