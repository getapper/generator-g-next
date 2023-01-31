import React, { memo } from "react";
import { useFormSelect } from "generators/pkg-mui/templates/src/components/_form/FormSelect/index.hooks";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

export type FormSelectProps = {
  options: {
    value: number | string;
    label: number | string;
  }[];
  label?: string;
  name?: string;
} & FormControlProps;

export const FormSelect = memo(
  ({ options, label, name, ...props }: FormSelectProps) => {
    const { control, errors } = useFormSelect();

    return (
      <Controller
        control={control}
        name={name!}
        render={({ field: { onChange, value, name, ref } }) => (
          <FormControl
            error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
            variant="outlined"
            {...props}
          >
            {label && (
              <InputLabel id={`mui-select-${name!.trim()}`}>{label}</InputLabel>
            )}
            <Select
              labelId={label ? `mui-select-${name!.trim()}` : ""}
              value={value}
              onChange={(ev) => onChange(ev.target.value)}
              variant="outlined"
              name={name}
              label={label}
              error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
            >
              {options.map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)
              ?.message && (
              <FormHelperText error>
                {
                  JsUtility.accessObjectByDotSeparatedKeys(errors, name)
                    ?.message
                }
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    );
  }
);
FormSelect.displayName = "FormSelect";
