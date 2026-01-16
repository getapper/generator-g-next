import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { useFormPhoneSelector } from "./index.hooks";

interface FormPhoneSelectorProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
  defaultCountryCode?: string;
}

const FormPhoneSelector: React.FC<FormPhoneSelectorProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  placeholder = "Enter phone number",
  fullWidth = false,
  defaultCountryCode,
}) => {
  const { control } = useFormContext();
  const {
    countries,
    selectedCountry,
    phoneNumber,
    handleCountryChange,
    handlePhoneChange,
  } = useFormPhoneSelector(name, defaultCountryCode);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            width: fullWidth ? "100%" : "auto",
          }}
        >
          <FormControl
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                height: "56px",
                "& fieldset": {
                  borderRight: "1px solid #e0e0e0",
                },
                "&:hover fieldset": {
                  borderRight: "1px solid #e0e0e0",
                },
                "&.Mui-focused fieldset": {
                  borderRight: "1px solid #e0e0e0",
                },
              },
            }}
          >
            <Select
              value={selectedCountry.code}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.code === e.target.value,
                );
                if (country) {
                  handleCountryChange(country);
                }
              }}
              disabled={disabled}
              displayEmpty
              sx={{
                "& .MuiSelect-select": {
                  color: "var(--Gray-700, #414651)",
                  fontFamily: "Inter",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--Gray-700, #414651)",
                      fontFamily: "Inter",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    {country.code} {country.dialCode}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            {...field}
            label={label}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            error={!!error}
            helperText={error?.message}
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                height: "56px",
                "& fieldset": {
                  borderLeft: "none",
                },
                "&:hover fieldset": {
                  borderLeft: "none",
                },
                "&.Mui-focused fieldset": {
                  borderLeft: "none",
                },
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default FormPhoneSelector;
