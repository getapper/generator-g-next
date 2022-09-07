import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserSession,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import Amplify, { Auth } from "aws-amplify";

export interface CognitoTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export class UserPoolManager {
  clientId: string;
  userPool: CognitoUserPool;
  attributesList: string[];
  user: CognitoUser;

  constructor(
    userPoolId: string,
    clientId: string,
    attributesList: string[] = [],
  ) {
    Amplify.configure({
      userPoolId,
      userPoolWebClientId: clientId,
    });
    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
    this.clientId = clientId;
    this.attributesList = attributesList;
    this.user = this.userPool.getCurrentUser();
  }

  async signup(
    email: string,
    password: string,
    attributes: any = {},
  ): Promise<CognitoUser> {
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes,
    });
    return user;
  }

  async login(email: string, password: string): Promise<CognitoUserSession> {
    const user = await Auth.signIn(email, password);
    this.user = user;
    if (
      user.challengeName === "SMS_MFA" ||
      user.challengeName === "SOFTWARE_TOKEN_MFA"
    ) {
      const e = new Error("MFA required");
      e["code"] = "MFARequired";
      throw e;
    }
    return user;
  }

  async recoveryPassword(email: string) {
    return await Auth.forgotPassword(email);
  }

  async resetPassword(email: string, code: string, password: string) {
    return await Auth.forgotPasswordSubmit(email, code, password);
  }

  async confirmAccount(email: string, code: string): Promise<any> {
    await Auth.confirmSignUp(email, code);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    await Auth.changePassword(this.user, oldPassword, newPassword);
  }

  async setUserAttributes(attributes: object) {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, attributes);
  }

  async refreshTokens(refreshToken: string): Promise<CognitoUserSession> {
    const cognitoUser: CognitoUser = await Auth.currentAuthenticatedUser();
    const RefreshToken = new CognitoRefreshToken({
      RefreshToken: refreshToken,
    });
    return await new Promise((res, rej) => {
      cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
          return rej(err);
        }
        res(session);
      });
    });
  }

  async verifyMFACode(
    code: string,
    mfaType: "SMS_MFA" | "SOFTWARE_TOKEN_MFA" = "SMS_MFA",
  ): Promise<CognitoUserSession> {
    return await Auth.confirmSignIn(this.user, code, mfaType);
  }
}
