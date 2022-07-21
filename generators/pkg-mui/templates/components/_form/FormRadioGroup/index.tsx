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
import { useFormRadioGroup } from "components/_form/FormRadioGroup/index.hooks";
import { Controller, RefCallBack } from "react-hook-form";
import { JsUtility } from "models/common";

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
    const { control, errors } = useFormRadioGroup();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name, ref } }) => {
          return (
            <FormControl
              error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
              variant="standard"
            >
              <FormLabel id={`${name}-controlled-radio-buttons-group`}>
                {label}
              </FormLabel>
              <RadioGroup
                aria-labelledby={`${name}-controlled-radio-buttons-group`}
                name={name}
                value={value}
                onChange={
                  onChange ? (ev) => onChange(ev.target.value) : undefined
                }
                onBlur={onBlur}
              >
                {options.map(({ label, value }) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio {...props} />}
                    inputRef={(e) => {
                      if (ref) {
                        ref(e);
                      }
                    }}
                    label={label}
                  />
                ))}
              </RadioGroup>
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
          );
        }}
      />
    );
  }
);
