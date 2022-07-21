import { useFormContext } from "react-hook-form";

export const useFormCheckbox = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
