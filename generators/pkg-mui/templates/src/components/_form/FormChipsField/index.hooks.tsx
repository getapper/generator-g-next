import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

export const useFormChipsField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [chipText, setChipText] = useState("");

  const onTagDelete = useCallback(
    (index: number, onChange: (newValue: string[]) => void, tags: string[]) => {
      const array = [...(Array.isArray(tags) ? tags : [])];
      array.splice(index, 1);
      onChange(array);
    },
    []
  );

  const onTagAdd = useCallback(
    (onChange: (newValue: string[]) => void, tags: string[]) => {
      if (chipText.trim() !== "" && !tags.includes(chipText)) {
        onChange([...(Array.isArray(tags) ? tags : []), chipText]);
      }
    },
    [chipText]
  );
  return {
    onTagDelete,
    onTagAdd,
    chipText,
    setChipText,
    errors,
    control,
  };
};
