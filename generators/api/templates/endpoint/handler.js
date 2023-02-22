module.exports = (apiNameCapital, useCookieAuth, role) => `import {
  ErrorResponse,
  ResponseHandler,
  StatusCodes,
} from "@/lib/response-handler";
import { NextApiResponse } from "next";
import { ${apiNameCapital}Api } from "./interfaces";

export default async function handler(
  req: ${apiNameCapital}Api.Request,
  res: NextApiResponse<${apiNameCapital}Api.EndpointResponse>
${useCookieAuth ? '  originalReq: NextApiRequest,\n' : ''}) {
  try {
    const { validationResult${useCookieAuth ? ', queryStringParameters' : ''} } = req;

    if (!validationResult.isValid) {
      return ResponseHandler.json<ErrorResponse>(
        res,
        { message: validationResult.message! },
        StatusCodes.BadRequest
      );
    }

    ${useCookieAuth ? `if(!originalReq.session.${role.toLowerCase()}){
      return ResponseHandler.json<ErrorResponse>(
        res,
        {},
        StatusCodes.Unauthorized,
      );
    }` : ``}

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
