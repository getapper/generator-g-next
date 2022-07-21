import { useFormContext } from "react-hook-form";

export const useFormDateTimePicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
