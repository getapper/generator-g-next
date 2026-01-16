import React, { memo } from "react";
import {
  Switch,
  SwitchProps,
  FormControl,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import { useFormSwitch } from "./index.hooks";

type FormSwitchProps = {
  name: string;
  label?: string;
  labelPosition?: "top" | "left";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "cart"
    | "rider";
} & SwitchProps;

export const FormSwitch = memo(
  ({
    name,
    label,
    labelPosition = "top",
    color = "default",
    ...props
  }: FormSwitchProps) => {
    const { value, handleChange, error } = useFormSwitch(name);

    return (
      <FormControl error={!!error} component="fieldset">
        <Box
          sx={{
            display: "flex",
            flexDirection: labelPosition === "left" ? "row" : "column",
            alignItems: labelPosition === "left" ? "center" : "flex-start",
            justifyContent:
              labelPosition === "left" ? "space-between" : "flex-start",
            gap: labelPosition === "left" ? 2 : 0,
          }}
        >
          {label && (
            <Typography
              component="label"
              sx={{
                color: "var(--Gray-700, #414651)",
                fontFamily: "var(--Font-family-font-family-body, Inter)",
                fontSize: "var(--Font-size-text-sm, 14px)",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "var(--Line-height-text-sm, 20px)",
                mb: labelPosition === "top" ? 1 : 0,
                cursor: "pointer",
              }}
              onClick={() => {
                // Allow clicking the label to toggle the switch
                if (labelPosition === "left") {
                  handleChange({ target: { checked: !value } } as any);
                }
              }}
            >
              {label}
            </Typography>
          )}
          <Switch
            name={name}
            checked={value}
            onChange={handleChange}
            color={color}
            {...props}
          />
        </Box>
        {!!error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    );
  },
);
FormSwitch.displayName = "FormSwitch";
