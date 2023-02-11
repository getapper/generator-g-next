import jwt from "jsonwebtoken";
import request from "request";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import AWS, { CognitoIdentityServiceProvider } from "aws-sdk";
import jwkToPem from "jwk-to-pem";
import { RequestI } from "lib/response-handler";

export interface AuthorizerResult {
  granted: boolean;
  serializedSession?: any;
  principalId?: string;
  username?: string;
}

export interface AwsJwt {
  header: {
    kid: string;
    alg: string;
  };
  payload: {
    sub: string;
    iss: string;
    email: string;
    event_id: string;
  };
}

export interface PoolInfo {
  id: string;
  attributes: string[];
}

export class CognitoSession {
  ["constructor"]: typeof CognitoSession;
  id: string;
  email: string;
  sub: string;
  username: string;

  async serialize(): Promise<string> {
    return JSON.stringify(this);
  }

  static async deserialize(session: string): Promise<CognitoSession> {
    const jwtSession = new CognitoSession();
    Object.assign(jwtSession, JSON.parse(session));
    return jwtSession;
  }
}

export abstract class UserPoolsManager {
  pools: UserPoolManager[];

  abstract get poolInfos(): PoolInfo[];

  async init() {
    try {
      this.pools = this.poolInfos.map(
        (poolInfo) =>
          new UserPoolManager(
            poolInfo.id,
            process.env[
              `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_POOL_ID`
            ],
            process.env[
              `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_CLIENT_ID`
            ],
            process.env[
              `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_AUTH_DOMAIN`
            ],
            process.env[
              `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_REDIRECT_URI`
            ],
            process.env[`RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_REGION`],
            poolInfo.attributes,
            process.env["RLN_COGNITO_AUTH_ACCESS_KEY_ID"],
            process.env["RLN_COGNITO_AUTH_SECRET_ACCESS_KEY"],
          ),
      );
      return Promise.all(this.pools.map(async (pool) => await pool.init()));
    } catch (e) {
      console.error(
        "MISSING COGNITO ENV OR INFOS!",
        this.poolInfos.map((poolInfo) => [
          poolInfo.id,
          process.env[`RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_POOL_ID`],
          process.env[
            `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_CLIENT_ID`
          ],
          process.env[
            `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_AUTH_DOMAIN`
          ],
          process.env[
            `RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_REDIRECT_URI`
          ],
          process.env[`RLN_COGNITO_AUTH_${poolInfo.id.toUpperCase()}_REGION`],
          poolInfo.attributes,
          process.env["RLN_COGNITO_AUTH_ACCESS_KEY_ID"],
          process.env["RLN_COGNITO_AUTH_SECRET_ACCESS_KEY"],
        ]),
      );
      throw e;
    }
  }
}

export class UserPoolManager {
  id: string;
  clientId: string;
  authDomain: string;
  redirectUri: string;
  userPool: CognitoUserPool;
  attributesList: string[];
  region: string;
  pems: any;
  iss: string;
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider;

  constructor(
    id: string,
    userPoolId: string,
    clientId: string,
    authDomain: string,
    redirectUri: string,
    region: string,
    attributesList: string[],
    accessKeyId?,
    secretAccessKey?,
  ) {
    this.id = id;
    this.userPool = new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
    this.clientId = clientId;
    this.authDomain = authDomain;
    this.redirectUri = redirectUri;
    this.attributesList = attributesList;
    this.region = region;
    this.iss = `https://cognito-idp.${
      this.region
    }.amazonaws.com/${this.userPool.getUserPoolId()}`;
    this.cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider({
        apiVersion: "2016-04-19",
        region,
        accessKeyId,
        secretAccessKey,
      });
  }

  async init() {
    global["fetch"] = fetch;
    return new Promise<void>((resolve, reject) => {
      request(
        {
          url: `${this.iss}/.well-known/jwks.json`,
          json: true,
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          }
          if (response.statusCode !== 200) {
            return reject(
              new Error(
                "Fetching pool jwks error: " + JSON.stringify(response?.body),
              ),
            );
          }
          this.pems = {};
          const keys = body["keys"];
          for (let i = 0; i < keys.length; i++) {
            const key_id = keys[i].kid;
            const modulus = keys[i].n;
            const exponent = keys[i].e;
            const key_type = keys[i].kty;
            const jwk = { kty: key_type, n: modulus, e: exponent };
            const pem = jwkToPem(jwk);
            this.pems[key_id] = pem;
          }
          resolve();
        },
      );
    });
  }
}

class AppUserPoolsManager extends UserPoolsManager {
  get poolInfos() {
    return [
      {
        id: "user",
        attributes: [],
      },
    ];
  }
}

const appUserPoolsManager = new AppUserPoolsManager();

export const verifyToken = async <T, Q>(
  req: RequestI<T, Q>,
): Promise<AuthorizerResult> => {
  const authResult: AuthorizerResult = {
    granted: false,
  };

  if (process.env.NODE_ENV === "test") {
    return {
      granted: !!req?.headers?.cognitoUsername,
      username: req?.headers?.cognitoUsername,
    };
  }

  try {
    // @TODO: In test mode, we want to jump this and get the session without passing through the token
    // like a serializes session object in another header key
    const token = req?.headers?.authorization?.split(" ")?.[1] ?? null;
    if (token !== null) {
      const decodedJwt = jwt.decode(token, { complete: true }) as AwsJwt;
      if (decodedJwt) {
        const kid = decodedJwt?.header.kid;
        await appUserPoolsManager.init();
        const userPool = appUserPoolsManager.pools.find(
          (pool) => pool.iss === decodedJwt?.payload?.iss,
        );
        if (userPool) {
          try {
            await new Promise<void>((resolve, reject) => {
              jwt.verify(token, userPool.pems[kid], (err) => {
                if (err) {
                  return reject(err);
                } else {
                  return resolve();
                }
              });
            });
            authResult.granted = true;
            authResult.principalId =
              decodedJwt?.payload?.event_id ?? decodedJwt?.payload?.sub;
            const cognito = new CognitoSession();
            Object.assign(cognito, decodedJwt.payload);
            cognito.id = authResult.principalId;
            authResult.serializedSession = await cognito.serialize();
            authResult.username = cognito.username;
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
  }

  return authResult;
};
