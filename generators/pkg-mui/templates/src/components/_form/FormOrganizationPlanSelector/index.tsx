import React, { memo } from "react";
import { useFormOrganizationPlanSelector } from "./index.hooks";
import { FormSelect } from "@/components/_form/FormSelect";
import { PaperProps, FormControlProps } from "@mui/material";

type FormOrganizationPlanSelectorProps = {
  name: string;
  label: string;
} & FormControlProps;

export const FormOrganizationPlanSelector = memo(
  ({ name, label, children, ...props }: FormOrganizationPlanSelectorProps) => {
    const { options } = useFormOrganizationPlanSelector();

    return (
      <FormSelect name={name} options={options} label={label} {...props} />
    );
  },
);
FormOrganizationPlanSelector.displayName = "FormOrganizationPlanSelector";
