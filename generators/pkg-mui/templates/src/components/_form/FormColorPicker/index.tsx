import React, { memo, useRef } from "react";
import { useFormColorPicker } from "./index.hooks";
import { TextField, InputAdornment, Box } from "@mui/material";

type FormColorPickerProps = {
  name: string;
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
};

export const FormColorPicker = memo(
  ({
    name,
    label,
    fullWidth = false,
    disabled = false,
  }: FormColorPickerProps) => {
    const { value, handleChange, error } = useFormColorPicker(name);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleColorClick = () => {
      if (!disabled && colorInputRef.current) {
        colorInputRef.current.showPicker();
      }
    };

    return (
      <Box sx={{ position: "relative" }}>
        <input
          ref={colorInputRef}
          type="color"
          value={value || "#000000"}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: disabled ? "not-allowed" : "pointer",
            zIndex: 1,
          }}
        />
        <TextField
          name={name}
          label={label}
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          error={!!error}
          helperText={error}
          fullWidth={fullWidth}
          disabled={disabled}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: value || "#000000",
                    border: "1px solid #ccc",
                    borderRadius: 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                    "&:hover": {
                      borderColor: disabled ? "#ccc" : "#999",
                    },
                  }}
                  onClick={handleColorClick}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    );
  },
);
FormColorPicker.displayName = "FormColorPicker";
