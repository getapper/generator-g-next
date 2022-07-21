import React, { memo } from "react";
import { useFormTextField } from "./index.hooks";
import { TextFieldProps, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { JsUtility } from "models/common";

export type FormTextFieldProps = {
  name: string;
  textFieldRef?: React.MutableRefObject<HTMLInputElement>;
} & TextFieldProps;

export const FormTextField = memo(
  ({ name, textFieldRef, inputRef, ...props }: FormTextFieldProps) => {
    const { control, errors } = useFormTextField();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name, ref } }) => {
          /**
           * The Controller helps us to switch from uncontrolled to controlled input.
           * The InputPropsCombined enhance the Input with custom styling.
           * The value and onChange are passed from the Controller and interact
           * directly with the react hook form control passed to the Input
           * The ref is both passed to the react hook form, and also to a custom
           * textFieldRef useful to trigger some side effect like .focus()
           */
          return (
            <TextField
              name={name}
              variant="outlined"
              {...props}
              onChange={(ev) => onChange(ev.target.value)}
              value={value}
              inputRef={(e) => {
                ref(e);
                if (textFieldRef) {
                  textFieldRef.current = e;
                }
              }}
              onBlur={onBlur}
              error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
              helperText={
                JsUtility.accessObjectByDotSeparatedKeys(errors, name)?.message
              }
            />
          );
        }}
      />
    );
  }
);
FormTextField.displayName = "FormTextField";
