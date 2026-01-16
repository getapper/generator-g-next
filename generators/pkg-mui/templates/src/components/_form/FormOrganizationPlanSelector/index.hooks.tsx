import {
import { useMemo } from "react";

enum OrganizationPlan {
  Free = "free",
  Starter = "starter",
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
}

const OrganizationPlanLabels: Record<OrganizationPlan, string> = {
  [OrganizationPlan.Free]: "Free",
  [OrganizationPlan.Starter]: "Starter",
  [OrganizationPlan.Bronze]: "Bronze",
  [OrganizationPlan.Silver]: "Silver",
  [OrganizationPlan.Gold]: "Gold",
  [OrganizationPlan.Platinum]: "Platinum",
};

export const useFormOrganizationPlanSelector = () => {
  const options = useMemo(
    () =>
      Object.values(OrganizationPlan).map((value) => ({
        value: value,
        label: OrganizationPlanLabels[value],
      })),
    [],
  );
  return { options };
};
