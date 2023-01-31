import React, { memo } from "react";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useFormCheckbox } from "generators/pkg-mui/templates/src/components/_form/FormCheckbox/index.hooks";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

type FormCheckboxProps = {
  name: string;
  label: string;
} & CheckboxProps;

export const FormCheckbox = memo(
  ({ name, label, ...props }: FormCheckboxProps) => {
    const { control, errors } = useFormCheckbox();

    return (
      <Controller
        control={control}
        name={name}
        defaultValue={false}
        render={({ field: { onChange, onBlur, value, name } }) => {
          return (
            <FormControl
              error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
              component="fieldset"
            >
              <FormControlLabel
                control={
                  <Checkbox
                    {...props}
                    name={name}
                    checked={value}
                    onChange={
                      onChange ? (ev) => onChange(ev.target.checked) : undefined
                    }
                    onBlur={onBlur}
                  />
                }
                label={label}
              />
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
FormCheckbox.displayName = "FormCheckbox";
