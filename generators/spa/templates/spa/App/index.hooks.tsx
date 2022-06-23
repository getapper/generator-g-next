import theme from "../themes";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions } from "spas/<%= spaFolderName %>/redux-store";

const useAppHooks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.appStartup());
  }, [dispatch]);

  return {
    theme,
  };
};

export default useAppHooks;
