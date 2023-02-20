import React, { memo } from "react";
import { useFormChips } from "./index.hooks";
import {
  Chip,
  Stack,
  TextField,
  TextFieldProps,
  StackProps,
} from "@mui/material";

type FormChipsProps = {
  name: string;
  label?: string;
  textFieldProps?: TextFieldProps;
} & StackProps;

export const FormChips = memo(
  ({ name, label, textFieldProps, ...props }: FormChipsProps) => {
    const {
      items,
      handleItemDeleted,
      text,
      handleTextChange,
      handleTextKeyDown,
      error,
    } = useFormChips(name);

    return (
      <Stack {...props}>
        <TextField
          value={text}
          error={!!error}
          helperText={error}
          onChange={handleTextChange}
          onKeyDown={handleTextKeyDown}
          label={label}
          {...textFieldProps}
        />
        <Stack spacing={1} direction={"row"} flexWrap={"wrap"}>
          {(Array.isArray(items) ? items : []).map((tag, index) => {
            return (
              <Chip
                key={tag}
                label={tag}
                sx={{ marginTop: "8px !important" }}
                variant={"outlined"}
                onDelete={handleItemDeleted[index]}
              />
            );
          })}
        </Stack>
      </Stack>
    );
  },
);
FormChips.displayName = "FormChips";
