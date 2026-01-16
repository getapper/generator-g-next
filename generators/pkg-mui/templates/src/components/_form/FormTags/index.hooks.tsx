import { useState } from "react";

type Tag = {
  id: string;
  value: string;
};

export const useFormTags = () => {
  const [value, setValue] = useState<Tag[]>([]);

  const handleChange = (newValue: Tag[]) => {
    setValue(newValue);
  };

  return {
    value,
    handleChange,
  };
};
