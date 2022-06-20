import React, { memo } from "react";
import { useFormTextField } from "./index.hooks";
import { TextFieldProps, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export type FormTextFieldProps = {
  control?: any;
  register?: any;
  value?: string;
} & TextFieldProps;

export const FormTextField = memo(
  ({
    name,
    control,
    register,
    value,
    onChange,
    ...props
  }: FormTextFieldProps) => {
    const {} = useFormTextField();

    const renderTextField = (value: string, onChange: any, onBlur?: any) => {
      const registerProps = register ? { ...register(name) } : {};
      return (
        <TextField
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...registerProps}
          {...props}
        />
      );
    };

    if (control) {
      return (
        <Controller
          control={control}
          name={name}
          defaultValue=""
          render={({ field: { value, onChange, onBlur } }) => {
            /**
             * The Controller helps us to switch from uncontrolled to controlled input.
             * The value and onChange are passed from the Controller and interact
             * directly with the react hook form control passed to the Input
             * The ref is both passed to the react hook form, and also to a custom
             * textFieldRef usefull to trigger some side effect like .focus()
             */
            return renderTextField(value, onChange, onBlur);
          }}
        />
      );
    }

    return renderTextField(value, onChange);
  },
);
