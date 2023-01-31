import { useFormContext } from "react-hook-form";

export const useFormTextField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return {
    control,
    errors,
  };
};
