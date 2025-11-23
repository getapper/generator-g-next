import React, { memo } from "react";
import { Controller } from "react-hook-form";
import { FormControl, FormHelperText, FormLabel } from "@mui/material";
import ReactQuill from "react-quill";
import { useFormRichTextField } from "./index.hooks";

type FormRichTextFieldProps = {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  sx?: object;
};

export const FormRichTextField = memo(
  ({
    name,
    label,
    placeholder,
    disabled = false,
    required = false,
    helperText,
    sx,
  }: FormRichTextFieldProps) => {
    const { quillModules, quillFormats } = useFormRichTextField();

    return (
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <FormControl
            fullWidth
            error={!!error}
            disabled={disabled}
            required={required}
            sx={sx}
          >
            {label && <FormLabel>{label}</FormLabel>}
            <div
              style={{
                border: error
                  ? "1px solid #d32f2f"
                  : "1px solid rgba(0, 0, 0, 0.23)",
                borderRadius: "4px",
                minHeight: "120px",
              }}
            >
              <ReactQuill
                theme="snow"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={placeholder}
                modules={quillModules}
                formats={quillFormats}
                readOnly={disabled}
                style={{
                  height: "100px",
                  border: "none",
                }}
              />
            </div>
            {(error?.message || helperText) && (
              <FormHelperText>
                {error?.message || helperText}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    );
  },
);

FormRichTextField.displayName = "FormRichTextField";
