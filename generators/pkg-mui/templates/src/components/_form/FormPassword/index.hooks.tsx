import React, { useCallback, useState } from "react";

export const useFormPassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setShowPassword((s) => !s);
    },
    [],
  );

  return {
    showPassword,
    handleTogglePassword,
  };
};
