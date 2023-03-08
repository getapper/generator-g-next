import React, { memo } from "react";
import useLanguageMenu from "./index.hooks";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import { Language } from "@/models/client/Language";
import Link from "next/link";
import { Locales } from "@/models/common/Translation";

type LanguageMenuProps = {
  basePath: string;
};

export const LanguageMenu = memo(({ basePath }: LanguageMenuProps) => {
  const {
    anchorOrigin,
    transformOrigin,
    anchorRef,
    isLanguageSelectorMenuOpen,
    handleLanguageSelectorMenuOpen,
    handleLanguageSelectorMenuClose,
    locale,
  } = useLanguageMenu();

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleLanguageSelectorMenuOpen}
        sx={{
          width: 44,
          height: 44,
        }}
        size="medium"
      >
        <Box
          component="img"
          src={Language.getFlagIconByLanguageValue(locale)}
          alt={Language.getLanguageNameByLanguageValue(locale)}
          sx={{
            width: 28,
            height: 22,
            borderRadius: "2px",
          }}
        />
      </IconButton>
      <Menu
        id="menu-language"
        anchorEl={anchorRef.current}
        open={isLanguageSelectorMenuOpen}
        onClose={handleLanguageSelectorMenuClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        PaperProps={{
          sx: {
            width: 200,
          },
        }}
      >
        <List disablePadding>
          {Object.values(Locales).map((newLocale, index) => (
            <Link key={newLocale} href={basePath} locale={newLocale}>
              <ListItemButton
                selected={newLocale === locale}
                sx={{
                  padding: "2px 20px",
                }}
              >
                <ListItemIcon
                  sx={{
                    padding: "5px",
                  }}
                >
                  <Box
                    component="img"
                    src={Language.getFlagIconByLanguageValue(newLocale)}
                    alt={Language.getLanguageNameByLanguageValue(newLocale)}
                    sx={{
                      width: 28,
                      height: 22,
                      borderRadius: "2px",
                    }}
                  />
                </ListItemIcon>
                <ListItemText>
                  {Language.getLanguageNameByLanguageValue(newLocale)}
                </ListItemText>
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Menu>
    </>
  );
});
