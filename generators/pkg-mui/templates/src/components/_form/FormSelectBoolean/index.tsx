import React, { memo } from "react";
import { useFormSelectBoolean } from "./index.hooks";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export type FormSelectBooleanProps = {
  name: string;
  options: {
    value: boolean;
    label: string;
  }[];
  label?: string;
} & FormControlProps;

export const FormSelectBoolean = memo(
  ({ name, options, label, ...props }: FormSelectBooleanProps) => {
    const { value, handleChange, error } = useFormSelectBoolean(name);

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
          sx={{
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D5D7DA",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D5D7DA",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#D5D7DA",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              value={option.value.toString()}
              key={option.value.toString()}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormSelectBoolean.displayName = "FormSelectBoolean";
