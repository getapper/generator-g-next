import React, { memo, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import { AppSnackbar } from "@/components/AppSnackbar";
import useAppHooks from "./index.hooks";
import domNavigation from "@/models/client/DomNavigation";

// Component to initialize domNavigation with useNavigate
const NavigationInitializer: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    domNavigation.navigate = navigate;
  }, [navigate]);

  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <NavigationInitializer />
      <Routes>
        <Route path="/" element={<span>TEST</span>} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  const { theme, open, type, message, handleClose } = useAppHooks();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="<%= basename %>">
        <AppRoutes />
      </BrowserRouter>
      <AppSnackbar
        open={open}
        message={message}
        severity={type}
        onClose={handleClose}
      />
    </ThemeProvider>
  );
};

export default memo(App);
