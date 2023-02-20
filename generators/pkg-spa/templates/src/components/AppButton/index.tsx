import React, { memo } from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";
import { useAppButton } from "./index.hooks";

type AppButtonProps = {
  loading?: boolean;
  path?: string;
} & ButtonProps;

export const AppButton = memo(
  ({ loading = false, path, onClick, ...props }: AppButtonProps) => {
    const { onButtonClicked } = useAppButton(path, onClick);

    if (loading) {
      return (
        <Button {...props} onClick={onButtonClicked}>
          <CircularProgress
            color={
              (props.color ?? "primary") === "primary" ? "secondary" : "primary"
            }
            size={24}
          />
        </Button>
      );
    }

    return <Button {...props} onClick={onButtonClicked} />;
  }
);
AppButton.displayName = "AppButton";
