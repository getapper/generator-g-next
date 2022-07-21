import { useFormContext } from "react-hook-form";

export const useFormSelect = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
