import React, { memo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import useAppHooks from "./index.hooks";

const App: React.FC = () => {
  const { theme } = useAppHooks();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="<%= basename %>">
        <Routes>
          <Route path="/" element={<span>TEST</span>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default memo(App);
