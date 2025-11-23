module.exports = (apiNameCapital, useCookieAuth, cookieRoleCamelCase, hasPayload) => `import {
  ErrorResponse,
  ResponseHandler,
  StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse${useCookieAuth ? ", NextApiRequest" : ""} } from "next";
import { ${apiNameCapital}Api } from "./interfaces";

export default async function handler(
  req: ${apiNameCapital}Api.Request,
  res: NextApiResponse<${apiNameCapital}Api.EndpointResponse>,
${useCookieAuth ? '  originalReq: NextApiRequest,\n' : ''}) {
  try {
    const { validationResult${useCookieAuth ? ', queryStringParameters' : ''}${hasPayload ? ', payload' : ''} } = req;

    ${useCookieAuth ? `if(!originalReq.session.${cookieRoleCamelCase}){
      return ResponseHandler.json<ErrorResponse>(
        res,
        {},
        StatusCodes.Unauthorized,
      );
    }` : ``}

    if (!validationResult.isValid) {
      return ResponseHandler.json<ErrorResponse>(
        res,
        { message: validationResult.message! },
        StatusCodes.BadRequest
      );
    }

    return ResponseHandler.json<${apiNameCapital}Api.SuccessResponse>(res, {});
  } catch (e) {
    console.error(e);
    return ResponseHandler.json<ErrorResponse>(
      res,
      { message: "Internal error" },
      StatusCodes.InternalServerError
    );
  }
}
`;
