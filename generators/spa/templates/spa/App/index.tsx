import React, { memo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Switch, Route } from "react-router-dom";
import useAppHooks from "./index.hooks";

const App: React.FC = () => {
  const { theme } = useAppHooks();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="/">
          <span>TEST</span>
        </Route>
      </Switch>
    </ThemeProvider>
  );
};

export default memo(App);
