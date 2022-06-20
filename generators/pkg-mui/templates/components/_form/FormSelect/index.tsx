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
import { Controller } from "react-hook-form";

export type FormSelectProps = {
  control?: any;
  options: {
    value: number | string;
    label: number | string;
  }[];
  label?: string;
  className?: string;
  selectClassName?: string;
  name?: string;
  helperText?: string;
  value?: any;
  onChange?: any;
} & FormControlProps;

export const FormSelect = memo(
  ({
    control,
    options,
    label,
    className,
    selectClassName,
    name,
    value,
    onChange,
    error,
    helperText,
    ...props
  }: FormSelectProps) => {
    const {} = useFormSelect();

    const renderSelect = (
      value1: string,
      onChange1: (newValue: string) => void,
    ) => {
      return (
        <FormControl
          error={error}
          variant="outlined"
          className={className}
          {...props}
        >
          {label && (
            <InputLabel id={`mui-select-${name!.trim()}`}>{label}</InputLabel>
          )}
          <Select
            className={selectClassName}
            labelId={label ? `mui-select-${name!.trim()}` : ""}
            value={value1}
            onChange={(ev) => onChange1(ev.target.value)}
            variant="outlined"
            name={name}
            label={label}
            error={error}
          >
            {options.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {helperText && (
            <FormHelperText error={error}>{helperText}</FormHelperText>
          )}
        </FormControl>
      );
    };

    if (!control) {
      return renderSelect(value, onChange);
    }
    return (
      <Controller
        control={control}
        name={name!}
        render={({ field: { onChange, value, name, ref } }) =>
          renderSelect(value, onChange)
        }
      />
    );
  },
);
