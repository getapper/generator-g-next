import { createAction } from "@reduxjs/toolkit";

export const appStartup = createAction("app/startup");
export const clearSession = createAction("app/clearSession");
