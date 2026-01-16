import { useFormContext, useWatch } from "react-hook-form";
import { useCallback } from "react";
import slugify from "slugify";

export const useFormSlugGenerator = (observedField: string, name: string) => {
  const { setFocus, setValue, control } = useFormContext();

  const field = useWatch({ control, name: observedField });

  const generateSlugFromTitle = useCallback(() => {
    setValue(
      name,
      slugify(field ?? "", {
        replacement: "-",
        remove: /[^a-zA-Z0-9\s-]/g,
        lower: true,
      }),
    );
  }, [setValue, name, field]);

  return {
    generateSlugFromTitle,
    field,
  };
};
