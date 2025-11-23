import React, { memo } from "react";
import { Box, useTheme } from "@mui/material";

type HTMLTextProps = {
  html: string;
  sx?: object;
};

export const HTMLText = memo(({ html, sx }: HTMLTextProps) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        "& p": {
          margin: 0,
          marginBottom: 1,
        },
        "& p:last-child": {
          marginBottom: 0,
        },
        "& ul": {
          margin: 0,
          marginBottom: 1,
          paddingLeft: 2,
          listStyleType: "disc",
        },
        "& ul:last-child": {
          marginBottom: 0,
        },
        "& ol": {
          margin: 0,
          marginBottom: 1,
          paddingLeft: 2,
          listStyleType: "decimal",
        },
        "& ol:last-child": {
          marginBottom: 0,
        },
        "& li": {
          marginBottom: 0.5,
          display: "list-item",
        },
        "& li:last-child": {
          marginBottom: 0,
        },
        // Nested lists
        "& ul ul": {
          listStyleType: "circle",
        },
        "& ul ul ul": {
          listStyleType: "square",
        },
        "& ol ol": {
          listStyleType: "lower-alpha",
        },
        "& ol ol ol": {
          listStyleType: "lower-roman",
        },
        "& strong, & b": {
          fontWeight: "bold",
        },
        "& em, & i": {
          fontStyle: "italic",
        },
        "& u": {
          textDecoration: "underline",
        },
        "& s, & strike, & del": {
          textDecoration: "line-through",
        },
        "& mark": {
          backgroundColor: "yellow",
          padding: "2px 4px",
        },
        "& sup": {
          verticalAlign: "super",
          fontSize: "0.75em",
        },
        "& sub": {
          verticalAlign: "sub",
          fontSize: "0.75em",
        },
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          margin: 0,
          marginTop: 2,
          marginBottom: 1,
          fontWeight: "bold",
          lineHeight: 1.2,
        },
        "& h1:first-child, & h2:first-child, & h3:first-child, & h4:first-child, & h5:first-child, & h6:first-child": {
          marginTop: 0,
        },
        "& h1:last-child, & h2:last-child, & h3:last-child, & h4:last-child, & h5:last-child, & h6:last-child": {
          marginBottom: 0,
        },
        "& h1": {
          fontSize: "2rem",
          marginTop: 3,
          marginBottom: 1.5,
        },
        "& h2": {
          fontSize: "1.5rem",
          marginTop: 2.5,
          marginBottom: 1.25,
        },
        "& h3": {
          fontSize: "1.25rem",
          marginTop: 2,
          marginBottom: 1,
        },
        "& h4": {
          fontSize: "1.125rem",
          marginTop: 1.5,
          marginBottom: 0.75,
        },
        "& h5": {
          fontSize: "1rem",
          marginTop: 1.25,
          marginBottom: 0.5,
        },
        "& h6": {
          fontSize: "0.875rem",
          marginTop: 1,
          marginBottom: 0.5,
        },
        "& blockquote": {
          margin: "1em 0",
          paddingLeft: "1em",
          borderLeft: `4px solid ${theme.palette.divider}`,
          color: theme.palette.text.secondary,
        },
        "& code": {
          fontFamily: "monospace",
          backgroundColor: theme.palette.action.hover,
          padding: "0.2em 0.4em",
          borderRadius: "3px",
        },
        "& pre": {
          fontFamily: "monospace",
          backgroundColor: theme.palette.action.hover,
          padding: "1em",
          borderRadius: "3px",
          overflowX: "auto",
        },
        "& a": {
          color: theme.palette.primary.main,
          textDecoration: "underline",
          "&:hover": {
            textDecoration: "none",
          },
        },
        "& hr": {
          border: "none",
          borderTop: "1px solid",
          borderTopColor: "divider",
          margin: "1rem 0",
        },
        // React Quill specific classes
        "& .ql-align-right": {
          textAlign: "right",
        },
        "& .ql-align-center": {
          textAlign: "center",
        },
        "& .ql-align-justify": {
          textAlign: "justify",
        },
        "& .ql-align-left": {
          textAlign: "left",
        },
        "& .ql-indent-1": { paddingLeft: "3em" },
        "& .ql-indent-2": { paddingLeft: "6em" },
        "& .ql-indent-3": { paddingLeft: "9em" },
        "& .ql-indent-4": { paddingLeft: "12em" },
        "& .ql-indent-5": { paddingLeft: "15em" },
        "& .ql-indent-6": { paddingLeft: "18em" },
        "& .ql-indent-7": { paddingLeft: "21em" },
        "& .ql-indent-8": { paddingLeft: "24em" },
        "& .ql-size-small": { fontSize: "0.875rem" },
        "& .ql-size-large": { fontSize: "1.5rem" },
        "& .ql-size-huge": { fontSize: "2.5em" },
        "& .ql-font-serif": { fontFamily: "serif" },
        "& .ql-font-monospace": { fontFamily: "monospace" },
        "& .ql-bold": { fontWeight: "bold" },
        "& .ql-italic": { fontStyle: "italic" },
        "& .ql-underline": { textDecoration: "underline" },
        "& .ql-strike": { textDecoration: "line-through" },
        "& .ql-color": {
          // Color is handled inline by React Quill
        },
        "& .ql-background": {
          // Background color is handled inline by React Quill
        },
        // React Quill heading classes
        "& .ql-size-huge": {
          fontSize: "2rem",
          marginTop: 3,
          marginBottom: 1.5,
          fontWeight: "bold",
          lineHeight: 1.2,
        },
        "& .ql-size-large": {
          fontSize: "1.5rem",
          marginTop: 2.5,
          marginBottom: 1.25,
          fontWeight: "bold",
          lineHeight: 1.2,
        },
        "& .ql-size-small": {
          fontSize: "0.875rem",
          marginTop: 1,
          marginBottom: 0.5,
          fontWeight: "bold",
          lineHeight: 1.2,
        },
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

HTMLText.displayName = "HTMLText";
