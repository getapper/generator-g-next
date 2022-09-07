import { RootState } from "spas/<%= spaFolderName %>/redux-store";

export const getCognitoAccessToken = (state: RootState) =>
  state?.cognito?.tokens?.access;
export const getCognitoIdToken = (state: RootState) =>
  state?.cognito?.tokens?.id;
export const getCognitoRefreshToken = (state: RootState) =>
  state?.cognito?.tokens?.refresh;
export const getCognitoAuthStatus = (state: RootState) =>
  state?.cognito?.authStatus;
export const getCognitoEmail = (state: RootState) => state?.cognito?.email;
export const getCognitoPassword = (state: RootState) =>
  state?.cognito?.password;
