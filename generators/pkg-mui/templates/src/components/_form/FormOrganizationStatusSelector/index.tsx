import React, { memo } from "react";
import { useFormOrganizationStatusSelector } from "./index.hooks";
import { FormSelect } from "@/components/_form/FormSelect";
import { FormControlProps } from "@mui/material";

type FormOrganizationStatusSelectorProps = {
  name: string;
  label: string;
} & FormControlProps;

export const FormOrganizationStatusSelector = memo(
  ({ name, label, ...props }: FormOrganizationStatusSelectorProps) => {
    const { options } = useFormOrganizationStatusSelector();

    return (
      <FormSelect name={name} options={options} label={label} {...props} />
    );
  },
);
FormOrganizationStatusSelector.displayName = "FormOrganizationStatusSelector";
