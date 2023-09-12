import { useCallback, useMemo, useRef, useState } from "react";
import { PopoverOrigin } from "@mui/material";
import { useRouter } from "next/router";
import { Locales } from "@/models/common/Translation";

const useLanguageMenu = () => {
  const anchorRef = useRef();
  const router = useRouter();
  const { locale } = router;

  const [isLanguageSelectorMenuOpen, setIsLanguageSelectorMenuOpen] =
    useState(false);

  const anchorOrigin = useMemo<PopoverOrigin>(
    () => ({ vertical: "bottom", horizontal: "right" }),
    [],
  );
  const transformOrigin = useMemo<PopoverOrigin>(
    () => ({ vertical: "top", horizontal: "right" }),
    [],
  );
  const handleLanguageSelectorMenuOpen = useCallback(
    () => setIsLanguageSelectorMenuOpen(true),
    [],
  );
  const handleLanguageSelectorMenuClose = useCallback(
    () => setIsLanguageSelectorMenuOpen(false),
    [],
  );

  return {
    anchorOrigin,
    transformOrigin,
    anchorRef,
    isLanguageSelectorMenuOpen,
    handleLanguageSelectorMenuOpen,
    handleLanguageSelectorMenuClose,
    locale: locale as Locales,
  };
};

export { useLanguageMenu as default };
