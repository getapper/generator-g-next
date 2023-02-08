import React, { memo } from "react";
import { useFormTextField } from "./index.hooks";
import { TextFieldProps, TextField } from "@mui/material";

export type FormTextFieldProps = {
  name: string;
} & TextFieldProps;

export const FormTextField = memo(
  ({ name, helperText, ...props }: FormTextFieldProps) => {
    const { value, handleChange, error } = useFormTextField(name);

    return (
      <TextField
        name={name}
        variant="outlined"
        onChange={handleChange}
        value={value}
        error={!!error}
        helperText={error ?? helperText}
        {...props}
      />
    );
  },
);
FormTextField.displayName = "FormTextField";
