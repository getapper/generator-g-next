import { useFormContext } from "react-hook-form";

export const useFormTimePicker = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
