import {
  HttpHeader,
  StatusCodes,
  ResponseOptions,
  Response,
  ValidationResult,
  RequestI,
} from "./interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";

export interface ValidationObjects {
  queryStringParameters?: yup.SchemaOf<object>;
  payload?: yup.SchemaOf<object>;
}

class ResponseHandler {
  static json<T>(
    res: NextApiResponse<T>,
    payload: T,
    statusCode: StatusCodes = StatusCodes.OK
    // options?: ResponseOptions
  ): void {
    /*
    const headers: HttpHeader = {};
    try {
      // const defaultHeaders = require(PathResolver.getDefaultHeadersConfigPath);
      Object.assign(headers, defaultHeaders);
    } catch (e) {}
    if (options?.headers) {
      Object.assign(headers, options?.headers);
    }
     */
    res.status(statusCode).json(payload);
  }

  static async handleRequest<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    validationsBuilder: () => ValidationObjects,
    handler: any
  ) {
    let queryStringParameters: any = req.query || {};
    let payload = req.body;
    const validations = validationsBuilder();
    const validationResult: ValidationResult = {
      isValid: true,
    };

    if (validations.queryStringParameters) {
      try {
        queryStringParameters =
          await validations.queryStringParameters.validate(
            queryStringParameters
          );
      } catch (e: any) {
        validationResult.isValid = false;
        validationResult.queryStringParametersErrors = e;
        queryStringParameters =
          validationResult.queryStringParametersErrors!.value;
        validationResult.message = e.message;
      }
    }
    if (validations.payload) {
      try {
        payload = await validations.payload.validate(payload);
      } catch (e: any) {
        validationResult.isValid = false;
        validationResult.payloadErrors = e;
        payload = validationResult.payloadErrors!.value;
        validationResult.message = e.message;
      }
    }
    return handler(
      {
        validationResult,
        queryStringParameters,
        payload,
      },
      res
    );
  }
}

export { ResponseHandler };

export * from "./interfaces";
