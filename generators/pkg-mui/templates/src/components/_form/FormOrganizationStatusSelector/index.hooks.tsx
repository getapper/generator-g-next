import {
import { useMemo } from "react";

enum OrganizationStatus {
  Active = "active",
  Disabled = "disabled",
}

const OrganizationStatusLabels: Record<OrganizationStatus, string> = {
  [OrganizationStatus.Active]: "Active",
  [OrganizationStatus.Disabled]: "Disabled",
};

export const useFormOrganizationStatusSelector = () => {
  const options = useMemo(
    () =>
      Object.values(OrganizationStatus).map((value) => ({
        value: value,
        label: OrganizationStatusLabels[value],
      })),
    [],
  );
  return { options };
};
