import { useFormContext } from "react-hook-form";

export const useFormRadioGroup = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
