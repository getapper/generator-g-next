import React, { memo } from "react";
import { FormProvider } from "react-hook-form";
import { useFormAssistantCtaTypeSelector } from "./index.hooks";
import { Button, Stack } from "@mui/material";
import { FormSelect } from "@/components/_form/FormSelect";

type FormAssistantCtaTypeSelectorProps = {
  name: string;
  label: string;
};

export const FormAssistantCtaTypeSelector = memo(
  ({ name, label }: FormAssistantCtaTypeSelectorProps) => {
    const { options } = useFormAssistantCtaTypeSelector();

    return <FormSelect name={name} options={options} label={label} />;
  },
);
FormAssistantCtaTypeSelector.displayName = "FormAssistantCtaTypeSelector";
