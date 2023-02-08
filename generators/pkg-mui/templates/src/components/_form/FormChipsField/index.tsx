import React, { memo } from "react";
import { useFormChipsField } from "generators/pkg-mui/templates/src/components/_form/FormChipsField/index.hooks";
import { Box, Chip, Stack, TextField, TextFieldProps } from "@mui/material";
import { Controller } from "react-hook-form";
import { SystemCssProperties } from "@mui/system";
import { JsUtility } from "models/common";

type FormChipsFieldProps = {
  name?: string;
} & TextFieldProps;

export const FormChipsField = memo(
  ({ name, sx, ...props }: FormChipsFieldProps) => {
    const { onTagAdd, onTagDelete, chipText, setChipText, errors, control } =
      useFormChipsField();

    return (
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Box sx={sx}>
            <TextField
              sx={{ width: "100%" }}
              value={chipText}
              error={!!JsUtility.accessObjectByDotSeparatedKeys(errors, name)}
              helperText={
                JsUtility.accessObjectByDotSeparatedKeys(errors, name)?.message
              }
              onChange={(e) => setChipText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  e.preventDefault();
                  onTagAdd(onChange, value);
                  setChipText("");
                }
              }}
              {...props}
            />
            <Stack spacing={1} direction={"row"} flexWrap={"wrap"}>
              {(Array.isArray(value) ? value : []).map((tag, index) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    sx={{ marginTop: "8px !important" }}
                    variant={"outlined"}
                    onDelete={() => onTagDelete(index, onChange, value)}
                  />
                );
              })}
            </Stack>
          </Box>
        )}
      />
    );
  }
);
FormChipsField.displayName = "FormChipsField";
