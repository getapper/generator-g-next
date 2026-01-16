import React, { memo } from "react";
import { FormSelect } from "@/components/_form/FormSelect";
import { useFormAssistantStatusSelector } from "../FormAssistantStatusSelector/index.hooks";

type FormAssistantStatusSelectorProps = {
  name: string;
  label: string;
};

export const FormAssistantStatusSelector = memo(
  ({ name, label }: FormAssistantStatusSelectorProps) => {
    const { options } = useFormAssistantStatusSelector();

    return <FormSelect name={name} options={options} label={label} />;
  },
);
FormAssistantStatusSelector.displayName = "FormAssistantStatusSelector";
