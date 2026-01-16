import React, { memo } from "react";
import { FormSelect } from "@/components/_form/FormSelect";
import { useFormAssistantTypeSelector } from "@/components/_form/FormAssistantTypeSelector/index.hooks";

type FormAssistantTypeSelectorProps = {
  name: string;
  label: string;
};

export const FormAssistantTypeSelector = memo(
  ({ name, label }: FormAssistantTypeSelectorProps) => {
    const { options } = useFormAssistantTypeSelector();

    return <FormSelect name={name} options={options} label={label} />;
  },
);
FormAssistantTypeSelector.displayName = "FormAssistantTypeSelector";
