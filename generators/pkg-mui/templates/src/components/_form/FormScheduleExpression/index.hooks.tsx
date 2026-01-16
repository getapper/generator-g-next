import { useFormContext } from "react-hook-form";

export const useFormScheduleExpression = (name: string) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const value = watch(name) || "";
  const error = errors[name]?.message as string;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(name, event.target.value, { shouldValidate: true });
  };

  return {
    value,
    handleChange,
    error,
  };
};
