import { UserPoolManager } from "models/client/UserPoolManager";
import { put, select, take, fork } from "redux-saga/effects";
import {
  actions,
  RootState,
  selectors,
} from "spas/<%= spaFolderName %>/redux-store";
import {
  CognitoAuthenticationStatus,
  CognitoChangePasswordAction,
  CognitoConfirmSignUpCodeAction,
  CognitoMFACodeAction,
  CognitoRecoveryPasswordAction,
  CognitoResetPasswordAction,
  CognitoSignInAction,
  CognitoSignUpAction,
} from "./cognito.interfaces";

export function* cognitoManager() {
  const userPoolManager = new UserPoolManager(
    process.env["NEXT_PUBLIC_COGNITO_USER_POOL_ID"],
    process.env["NEXT_PUBLIC_COGNITO_CLIENT_ID"],
    ["email"]
  );

  while (true) {
    const action = yield take([
      actions.appStartup,
      actions.cognitoSignUp,
      actions.cognitoSignIn,
      actions.cognitoConfirmSignUpCode,
      actions.cognitoMFACode,
      actions.cognitoRefreshTokens,
      actions.cognitoRecoveryPassword,
      actions.cognitoResetPassword,
      actions.cognitoChangePassword,
    ]);
    switch (action.type) {
      case actions.appStartup.type:
        yield fork(cognitoAppStartupSaga);
        break;
      case actions.cognitoSignUp.type:
        yield fork(cognitoSignUpSaga, userPoolManager, action);
        break;
      case actions.cognitoSignIn.type:
        yield fork(
          cognitoSignInCodeSaga,
          userPoolManager,
          (action as CognitoSignInAction).payload.email,
          (action as CognitoSignInAction).payload.password
        );
        break;
      case actions.cognitoConfirmSignUpCode.type:
        yield fork(cognitoConfirmSignUpCodeSaga, userPoolManager, action);
        break;
      case actions.cognitoMFACode.type:
        yield fork(cognitoMFACodeSaga, userPoolManager, action);
        break;
      case actions.cognitoRefreshTokens.type:
        yield fork(cognitoRefreshTokensSaga, userPoolManager);
        break;
      case actions.cognitoRecoveryPassword.type:
        yield fork(
          cognitoRecoveryPasswordSaga,
          userPoolManager,
          (action as CognitoRecoveryPasswordAction).payload.email
        );
        break;
      case actions.cognitoResetPassword.type:
        yield fork(
          cognitoResetPasswordSaga,
          userPoolManager,
          (action as CognitoResetPasswordAction).payload.code,
          (action as CognitoResetPasswordAction).payload.password
        );
        break;
      case actions.cognitoChangePassword.type:
        yield fork(
          cognitoChangePasswordSaga,
          userPoolManager,
          (action as CognitoChangePasswordAction).payload.oldPassword,
          (action as CognitoChangePasswordAction).payload.newPassword
        );
        break;
    }
  }
}

function* cognitoAppStartupSaga() {
  yield put(actions.cognitoChecking());
  const accessToken = yield select(selectors.getCognitoAccessToken);
  let isLogged = false;
  if (accessToken) {
    /*
    yield put(actions.getUsersMe.request({}));
    const resultAction = yield take([
      actions.getUsersMe.success.type,
      actions.getUsersMe.fail.type,
    ]);
    if (resultAction.type === actions.getUsersMe.success.type) {
      isLogged = true;
    } else {
      yield put(actions.clearSession());
    }
     */
    isLogged = true;
  }
  if (isLogged) {
    yield put(actions.cognitoValidSession());
  } else {
    yield put(
      actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.LoggedOut)
    );
    yield put(actions.clearSession());
  }
}

function* cognitoSignUpSaga(
  userPoolManager: UserPoolManager,
  action: CognitoSignUpAction
) {
  const { email, password, phone } = action.payload;

  try {
    yield userPoolManager.signup(email, password, {
      email,
      phone_number: phone,
    });
    yield put(
      actions.cognitoSetAuthStatus(
        CognitoAuthenticationStatus.WaitingConfirmCode
      )
    );
  } catch (e) {
    yield put(
      actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.LoggedOut)
    );
    yield put(actions.cognitoSetAwsError(e));
  }
}

function* cognitoRefreshTokensSaga(userPoolManager: UserPoolManager) {
  try {
    const refreshToken = yield select(selectors.getCognitoRefreshToken);
    const cognitoUserSession = yield userPoolManager.refreshTokens(
      refreshToken
    );
    yield put(
      actions.cognitoSetTokens({
        id: cognitoUserSession.idToken.jwtToken,
        access: cognitoUserSession.accessToken.jwtToken,
        refresh: cognitoUserSession.refreshToken.token,
      })
    );
  } catch (e) {
    yield put(actions.clearSession());
  }
}

function* cognitoConfirmSignUpCodeSaga(
  userPoolManager: UserPoolManager,
  action: CognitoConfirmSignUpCodeAction
) {
  const { email, password, code } = action.payload;

  try {
    yield userPoolManager.confirmAccount(email, code);
    if (password) {
      yield cognitoSignInCodeSaga(userPoolManager, email, password);
    } else {
      yield put(
        actions.cognitoSetAuthStatus(
          CognitoAuthenticationStatus.SignUpCodeConfirmed
        )
      );
    }
  } catch (e) {
    yield put(
      actions.cognitoSetAuthStatus(
        CognitoAuthenticationStatus.WaitingConfirmCode
      )
    );
    yield put(actions.cognitoSetAwsError(e));
  }
}

function* cognitoSignInCodeSaga(
  userPoolManager: UserPoolManager,
  email: string,
  password: string
) {
  try {
    const cognitoUserSession = yield userPoolManager.login(email, password);
    yield put(
      actions.cognitoSetTokens({
        id: cognitoUserSession.signInUserSession.idToken.jwtToken,
        access: cognitoUserSession.signInUserSession.accessToken.jwtToken,
        refresh: cognitoUserSession.signInUserSession.refreshToken.token,
      })
    );
  } catch (e) {
    console.error(e?.code);
    if (e?.code === "MFARequired") {
      yield put(
        actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.MFARequired)
      );
    } else if (e?.code === "UserNotConfirmedException") {
      yield put(
        actions.cognitoSetAuthStatus(
          CognitoAuthenticationStatus.WaitingConfirmCode
        )
      );
    } else {
      yield put(
        actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.LoggedOut)
      );
      yield put(actions.cognitoSetAwsError(e));
    }
  }
}

function* cognitoMFACodeSaga(
  userPoolManager: UserPoolManager,
  action: CognitoMFACodeAction
) {
  const { code } = action.payload;

  try {
    const cognitoUserSession = yield userPoolManager.verifyMFACode(code);
    yield put(
      actions.cognitoSetTokens({
        id: cognitoUserSession.signInUserSession.idToken.jwtToken,
        access: cognitoUserSession.signInUserSession.accessToken.jwtToken,
        refresh: cognitoUserSession.signInUserSession.refreshToken.token,
      })
    );
  } catch (e) {
    console.error(e?.code);
    if (e?.code === "MFARequired") {
      yield put(
        actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.MFARequired)
      );
    } else {
      yield put(actions.cognitoSetAwsError(e));
    }
  }
}

function* cognitoRecoveryPasswordSaga(
  userPoolManager: UserPoolManager,
  email: string
) {
  try {
    yield userPoolManager.recoveryPassword(email);
  } catch (e) {
    console.error(e);
    yield put(
      actions.cognitoSetAuthStatus(CognitoAuthenticationStatus.LoggedOut)
    );
    yield put(actions.cognitoSetAwsError(e));
  }
}

function* cognitoResetPasswordSaga(
  userPoolManager: UserPoolManager,
  code: string,
  password: string
) {
  try {
    const state: RootState = yield select();
    const email = selectors.getCognitoEmail(state);
    yield userPoolManager.resetPassword(email, code, password);
    yield put(actions.cognitoResetPasswordSuccess());
  } catch (e) {
    console.error(e);
    yield put(actions.cognitoSetAwsError(e));
  }
}

function* cognitoChangePasswordSaga(
  userPoolManager: UserPoolManager,
  oldPassword: string,
  newPassword: string
) {
  try {
    yield userPoolManager.changePassword(oldPassword, newPassword);
    yield put(actions.cognitoChangePasswordSuccess());
  } catch (e) {
    console.error(e);
    yield put(actions.cognitoSetAwsError(e));
  }
}
