import { useMemo } from "react";

enum AssistantType {
  Seller = "seller",
}

const AssistantTypeLabels: Record<AssistantType, string> = {
  [AssistantType.Seller]: "Sales Assistant",
};

export const useFormAssistantTypeSelector = () => {
  const options = useMemo(
    () =>
      Object.values(AssistantType).map((value) => ({
        value: value,
        label: AssistantTypeLabels[value],
      })),
    [],
  );

  return {
    options,
  };
};
