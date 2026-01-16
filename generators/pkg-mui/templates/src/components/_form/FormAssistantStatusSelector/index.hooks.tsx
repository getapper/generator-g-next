import { useMemo } from "react";

enum AssistantStatus {
  Active = "active",
  Pending = "pending",
  Error = "error",
}

const AssistantStatusLabels: Record<AssistantStatus, string> = {
  [AssistantStatus.Active]: "Active",
  [AssistantStatus.Pending]: "Pending",
  [AssistantStatus.Error]: "Error",
};

export const useFormAssistantStatusSelector = () => {
  const options = useMemo(
    () =>
      Object.values(AssistantStatus).map((value) => ({
        value: value,
        label: AssistantStatusLabels[value],
      })),
    [],
  );

  return {
    options,
  };
};
