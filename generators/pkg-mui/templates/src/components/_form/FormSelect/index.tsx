import React, { memo } from "react";
import { useFormSelect } from "./index.hooks";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export type FormSelectProps = {
  name: string;
  options: {
    value: number | string;
    label: number | string;
  }[];
  label?: string;
} & FormControlProps;

export const FormSelect = memo(
  ({ name, options, label, ...props }: FormSelectProps) => {
    const { value, handleChange, error } = useFormSelect(name);

    return (
      <FormControl error={!!error} variant="outlined" {...props}>
        {label && (
          <InputLabel id={`mui-select-${name.trim()}`}>{label}</InputLabel>
        )}
        <Select
          labelId={label ? `mui-select-${name.trim()}` : ""}
          value={value}
          onChange={handleChange}
          variant="outlined"
          name={name}
          label={label}
          error={!!error}
        >
          {options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormSelect.displayName = "FormSelect";
