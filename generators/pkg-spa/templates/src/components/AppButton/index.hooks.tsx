import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export const useAppButton = (path: string, onClick?: any) => {
  const navigate = useNavigate();

  const onButtonClicked = useMemo(
    () => (path ? () => navigate(path) : onClick),
    [navigate, path, onClick],
  );

  return {
    onButtonClicked,
  };
};
