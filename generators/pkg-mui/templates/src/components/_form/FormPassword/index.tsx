import React, { memo } from "react";
import { useFormPassword } from "./index.hooks";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  FormTextField,
  FormTextFieldProps,
} from "@/components/_form/FormTextField";

export type FormPasswordProps = {
  name: string;
} & FormTextFieldProps;

export const FormPassword = memo(
  ({ name, helperText, ...props }: FormPasswordProps) => {
    const { showPassword, handleTogglePassword } = useFormPassword();

    return (
      <FormTextField
        name={name}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleTogglePassword}>
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          ),
        }}
        {...props}
      />
    );
  },
);
FormPassword.displayName = "FormPassword";
