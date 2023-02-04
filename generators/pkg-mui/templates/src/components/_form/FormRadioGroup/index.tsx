import React, { memo } from "react";
import {
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useFormRadioGroup } from "./index.hooks";

type FormRadioGroupProps = {
  name: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
} & CheckboxProps;

export const FormRadioGroup = memo(
  ({ name, label, options, ...props }: FormRadioGroupProps) => {
    const { value, handleChange, error } = useFormRadioGroup(name);

    return (
      <FormControl error={!!error} variant="standard">
        <FormLabel id={`${name}-controlled-radio-buttons-group`}>
          {label}
        </FormLabel>
        <RadioGroup
          aria-labelledby={`${name}-controlled-radio-buttons-group`}
          name={name}
          value={value}
          onChange={handleChange}
        >
          {options.map(({ label, value }) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio {...props} />}
              label={label}
            />
          ))}
        </RadioGroup>
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormRadioGroup.displayName = "FormRadioGroup";
