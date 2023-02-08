import { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import useFormField from "@/hooks/useFormField";

export const useFormChips = (name: string) => {
  const { value: items, setValue, error } = useFormField<string[]>({ name });

  const [text, setText] = useState("");

  const handleItemDeleted = useMemo(
    () =>
      (items ?? []).map((_item, index) => () => {
        const array = [...(Array.isArray(items) ? items : [])];
        array.splice(index, 1);
        setValue(array);
      }),
    [items, setValue],
  );

  const handleItemAdded = useCallback(() => {
    if (text.trim() !== "" && !items.includes(text)) {
      setValue([...(Array.isArray(items) ? items : []), text]);
    }
  }, [text, setValue, items]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
    },
    [],
  );

  const handleTextKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.stopPropagation();
        event.preventDefault();
        handleItemAdded();
        setText("");
      }
    },
    [handleItemAdded],
  );

  return {
    items,
    handleItemAdded,
    handleItemDeleted,
    text,
    handleTextChange,
    handleTextKeyDown,
    error,
  };
};
