import React from "react";
import { Controller } from "react-hook-form";
import {
  Autocomplete,
  Box,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormAddressSelector } from "./index.hooks";

interface FormAddressSelectorProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}

const FormAddressSelector: React.FC<FormAddressSelectorProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  placeholder = "Search for an address...",
  fullWidth = false,
}) => {
  const {
    control,
    currentValue,
    mapRef,
    options,
    inputValue,
    loading,
    handleInputChange,
    handleSelectionChange,
  } = useFormAddressSelector(name);

  return (
    <>
      <div ref={mapRef} style={{ display: "none" }} />
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Autocomplete
            {...field}
            options={options || []}
            value={
              currentValue
                ? {
                    description: currentValue.formatted_address,
                    place_id: currentValue.place_id,
                    matched_substrings: [],
                    structured_formatting: {
                      main_text: currentValue.formatted_address,
                      secondary_text: "",
                      main_text_matched_substrings: [],
                    },
                    terms: [],
                    types: [],
                  }
                : null
            }
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleSelectionChange}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.description || ""
            }
            isOptionEqualToValue={(option, value) =>
              option.place_id === value?.place_id
            }
            loading={loading}
            disabled={disabled}
            fullWidth={fullWidth}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                required={required}
                placeholder={placeholder}
                error={!!error}
                helperText={error?.message}
                fullWidth={fullWidth}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box>
                  <Typography variant="body2">
                    {option.structured_formatting?.main_text ||
                      option.description}
                  </Typography>
                  {option.structured_formatting?.secondary_text && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "var(--Gray-700, #414651)",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                      }}
                    >
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
            noOptionsText="No addresses found"
            loadingText="Searching addresses..."
          />
        )}
      />
    </>
  );
};

export default FormAddressSelector;
