import { createSlice } from "@reduxjs/toolkit";
import * as selectors from "./cognito.selectors";
import {
  CognitoAuthenticationStatus,
  CognitoAWSErrorAction,
  CognitoConfirmSignUpCodeAction,
  CognitocognitoSetAuthStatusAction,
  CognitoSignInAction,
  CognitoSignUpAction,
  CognitoState,
  CognitoSetTokensAction,
  CognitoMFACodeAction,
  CognitoRecoveryPasswordAction,
  CognitoResetPasswordAction,
  CognitoChangePasswordAction,
} from "./cognito.interfaces";
import * as sagas from "./cognito.sagas";
import * as extraActions from "../../extra-actions";

const initialState: CognitoState = {
  authStatus: CognitoAuthenticationStatus.LoggedOut,
  email: null,
  password: null,
  phone: null,
  tokens: null,
  awsError: null,
};

export const cognitoStore = createSlice({
  name: "cognito",
  initialState,
  reducers: {
    cognitoSignUp: (state, action: CognitoSignUpAction) => {
      state.authStatus = CognitoAuthenticationStatus.SigningUp;
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.phone = action.payload.phone;
      state.awsError = null;
    },
    cognitoConfirmSignUpCode: (
      state,
      action: CognitoConfirmSignUpCodeAction,
    ) => {
      state.authStatus = CognitoAuthenticationStatus.ConfirmingSignupCode;
      state.awsError = null;
    },
    cognitoSignIn: (state, action: CognitoSignInAction) => {
      state.authStatus = CognitoAuthenticationStatus.SigningIn;
      state.awsError = null;
    },
    cognitoMFACode: (state, action: CognitoMFACodeAction) => {
      state.authStatus = CognitoAuthenticationStatus.ConfirmingSignupCode;
      state.awsError = null;
    },
    cognitoSetTokens: (state, action: CognitoSetTokensAction) => {
      state.authStatus = CognitoAuthenticationStatus.LoggedIn;
      state.tokens = action.payload;
      state.awsError = null;
      state.email = null;
      state.password = null;
    },
    cognitoSetAwsError: (state, action: CognitoAWSErrorAction) => {
      state.awsError = action.payload;
    },
    cognitoSetAuthStatus: (
      state,
      action: CognitocognitoSetAuthStatusAction,
    ) => {
      state.authStatus = action.payload;
    },
    cognitoChecking: (state) => {
      state.authStatus = CognitoAuthenticationStatus.Checking;
      state.awsError = null;
      state.email = null;
      state.password = null;
    },
    cognitoValidSession: (state) => {
      state.authStatus = CognitoAuthenticationStatus.LoggedIn;
    },
    cognitoRefreshTokens: (state) => {
      state.authStatus = CognitoAuthenticationStatus.RefreshingTokens;
    },
    cognitoRecoveryPassword: (state, action: CognitoRecoveryPasswordAction) => {
      state.email = action.payload.email;
      state.authStatus = CognitoAuthenticationStatus.RecoveringPassword;
    },
    cognitoResetPassword: (state, action: CognitoResetPasswordAction) => {
      state.password = action.payload.password;
      state.authStatus = CognitoAuthenticationStatus.ResettingPassword;
    },
    cognitoResetPasswordSuccess: (state) => {
      state.email = null;
      state.password = null;
      state.authStatus = CognitoAuthenticationStatus.LoggedOut;
    },
    cognitoChangePassword: (state, action: CognitoChangePasswordAction) => {
      state.password = action?.payload?.newPassword;
      state.authStatus = CognitoAuthenticationStatus.ChangingPassword;
    },
    cognitoChangePasswordSuccess: (state) => {
      state.authStatus = CognitoAuthenticationStatus.LoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(extraActions.clearSession, (state) => {
      state.tokens = null;
      state.authStatus = CognitoAuthenticationStatus.LoggedOut;
      state.phone = null;
      state.email = null;
      state.password = null;
      state.awsError = null;
    });
  },
});

export { selectors, sagas };
