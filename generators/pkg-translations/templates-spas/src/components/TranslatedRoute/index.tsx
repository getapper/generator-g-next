import React, { FC, memo, PropsWithChildren, ReactNode } from "react";
import { useTranslatedRoute } from "@/components/TranslatedRoute/index.hooks";

export const TranslatedRoute: FC<PropsWithChildren> = memo(({ children }) => {
  useTranslatedRoute();

  return <>{children}</>;
});
TranslatedRoute.displayName = "Route";
