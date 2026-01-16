import React, { memo } from "react";
import { useController, useFormContext } from "react-hook-form";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

type FormTagsProps = {
  name: string;
  label: string;
  options: { id: string; value: string }[];
};

export const FormTags = memo(({ name, label, options }: FormTagsProps) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  return (
    <Autocomplete
      multiple
      id={`form-tags-${name}`}
      options={options}
      getOptionLabel={(option) => option.value}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return <Chip key={key} label={option.value} {...tagProps} />;
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          placeholder="Add..."
        />
      )}
      PaperComponent={(props) => (
        <div {...props} style={{ backgroundColor: "white" }} />
      )}
      sx={{
        width: "100%",
        zIndex: 999999,
      }}
    />
  );
});
FormTags.displayName = "FormTags";
