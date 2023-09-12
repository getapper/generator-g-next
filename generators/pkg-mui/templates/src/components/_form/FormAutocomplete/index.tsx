import React, { memo } from "react";
import { useFormAutocomplete } from "./index.hooks";
import {
  Autocomplete,
  AutocompleteProps,
  FormControl,
  FormHelperText,
  MenuItem,
  TextField,
} from "@mui/material";

type FormAutocompleteProps<T> = {
  name: string;
  label?: string;
  options: T[];
} & Omit<
  Omit<
    Omit<AutocompleteProps<T, boolean, boolean, boolean>, "options">,
    "renderOption"
  >,
  "renderInput"
>;

export const FormAutocomplete = memo(
  <T extends { id: string; value?: string }>({
    name,
    label,
    options,
    ...props
  }: FormAutocompleteProps<T>) => {
    const { value, handleChange, error } = useFormAutocomplete<T>(
      name,
      options,
    );

    return (
      <FormControl error={!!error} variant="standard">
        <Autocomplete
          {...props}
          onChange={handleChange}
          value={value}
          options={options}
          getOptionLabel={(option: T) => option.value}
          renderOption={(params, option: T) => (
            <MenuItem {...params}>{option.value}</MenuItem>
          )}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormAutocomplete.displayName = "FormAutocomplete";
