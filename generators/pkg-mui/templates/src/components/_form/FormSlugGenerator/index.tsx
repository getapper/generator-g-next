import React, { memo } from "react";
import { useFormSlugGenerator } from "./index.hooks";
import { FormTextField } from "../FormTextField";
import { IconButton, Stack, TextFieldProps, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

type FormSlugGeneratorProps = {
  name: string;
  observedField: string;
} & TextFieldProps;

export const FormSlugGenerator = memo(
  ({ name, observedField, ...props }: FormSlugGeneratorProps) => {
    const { generateSlugFromTitle } = useFormSlugGenerator(observedField, name);

    return (
      <Stack direction="row" spacing={1} width="100%">
        <FormTextField name={name} {...props} sx={{ flex: 1 }} />
        <Tooltip title={"Generate slug"}>
          <IconButton sx={{ width: 55 }} onClick={generateSlugFromTitle}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    );
  },
);
FormSlugGenerator.displayName = "FormSlugGenerator";
