import { useFormContext } from "react-hook-form";

export const useFormDatePicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
