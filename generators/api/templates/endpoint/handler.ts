import { NextApiResponse } from "next";
import { ResponseHandler, StatusCodes } from "lib/response-handler";
import { EndpointResponse, Request } from "./interfaces";

export default function handler(
  req: Request,
  res: NextApiResponse<EndpointResponse>
) {
  try {
    const { validationResult } = req;

    if (!validationResult.isValid) {
      return ResponseHandler.json(
        res,
        { message: validationResult.message! },
        StatusCodes.BadRequest
      );
    }

    ResponseHandler.json<EndpointResponse>(res, {});
  } catch (e) {
    console.error(e);
    return ResponseHandler.json(
      res,
      { message: "Internal error" },
      StatusCodes.InternalServerError
    );
  }
}
