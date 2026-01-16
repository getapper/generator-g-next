import { useMemo } from "react";

enum AssistantCtaTypes {
  WhatsApp = "whatsapp",
  Email = "email",
  Phone = "phone",
  Link = "link",
}

const AssistantCtaTypesLabels: Record<AssistantCtaTypes, string> = {
  [AssistantCtaTypes.WhatsApp]: "WhatsApp",
  [AssistantCtaTypes.Email]: "Email",
  [AssistantCtaTypes.Phone]: "Phone",
  [AssistantCtaTypes.Link]: "Link",
};

export const useFormAssistantCtaTypeSelector = () => {
  const options = useMemo(
    () =>
      Object.values(AssistantCtaTypes).map((value) => ({
        value: value,
        label: AssistantCtaTypesLabels[value],
      })),
    [],
  );

  return {
    options,
  };
};
