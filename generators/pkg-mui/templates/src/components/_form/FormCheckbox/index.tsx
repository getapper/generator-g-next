import React, { memo } from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useFormCheckbox } from "./index.hooks";

type FormCheckboxProps = {
  name: string;
  label?: string;
} & CheckboxProps;

export const FormCheckbox = memo(
  ({ name, label, ...props }: FormCheckboxProps) => {
    const { value, handleChange, error } = useFormCheckbox(name);

    return (
      <FormControl error={!!error} component="fieldset">
        <FormControlLabel
          control={
            <Checkbox
              name={name}
              checked={value}
              onChange={handleChange}
              {...props}
            />
          }
          label={label}
        />
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormCheckbox.displayName = "FormCheckbox";
