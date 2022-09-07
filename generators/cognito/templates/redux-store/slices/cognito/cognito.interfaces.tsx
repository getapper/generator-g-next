export enum CognitoAuthenticationStatus {
  Checking = "checking",
  LoggedOut = "logged_out",
  SigningUp = "signing_up",
  WaitingConfirmCode = "waiting_email_confirm_code",
  ConfirmingSignupCode = "confirming_signup_code",
  SignUpCodeConfirmed = "signup_code_confirmed",
  MFARequired = "mfa_required",
  SigningIn = "signing-in",
  LoggedIn = "logged-in",
  RefreshingTokens = "refreshing-tokens",
  RecoveringPassword = "recovering-password",
  ResettingPassword = "resetting-password",
  ChangingPassword = "changing-password",
}

export interface CognitoState {
  authStatus: CognitoAuthenticationStatus;
  email: string;
  password: string;
  phone: string;
  tokens: {
    id: string;
    access: string;
    refresh: string;
  };
  awsError: {
    code: string;
    name: string;
    message: string;
  };
}

export type CognitoSignUpAction = {
  payload: {
    email: string;
    password: string;
    phone?: string;
  };
};

export type CognitoConfirmSignUpCodeAction = {
  payload: {
    email: string;
    password: string;
    code: string;
  };
};

export type CognitoMFACodeAction = {
  payload: {
    code: string;
  };
};

export type CognitoPhoneNumberSubmitAction = {
  payload: {
    phone: string;
  };
};

export type CognitoSignInAction = {
  payload: {
    email: string;
    password: string;
  };
};

export type CognitoRecoveryPasswordAction = {
  payload: {
    email: string;
  };
};

export type CognitoResetPasswordAction = {
  payload: {
    code: string;
    password: string;
  };
};

export type CognitoChangePasswordAction = {
  payload: {
    oldPassword: string;
    newPassword: string;
  };
};

export type CognitoSetTokensAction = {
  payload: {
    id: string;
    access: string;
    refresh: string;
  };
};

export type CognitocognitoSetAuthStatusAction = {
  payload: CognitoAuthenticationStatus;
};

export type CognitoAWSErrorAction = {
  payload: {
    code: string;
    name: string;
    message: string;
  };
};
