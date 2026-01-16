import React, { memo, useMemo } from "react";
import {
  Slider,
  SliderProps,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useFormSlider } from "./index.hooks";

type FormSliderProps = {
  name: string;
} & Omit<SliderProps, "value" | "onChange" | "name">;

export const FormSlider = memo(({ name, ...props }: FormSliderProps) => {
  const { value, handleChange, error } = useFormSlider(name);

  return (
    <FormControl error={!!error} fullWidth>
      <Slider
        name={name}
        value={value || props.min || 0}
        onChange={handleChange}
        {...props}
      />
      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
});
FormSlider.displayName = "FormSlider";
