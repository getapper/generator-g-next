import { StatusCodes, ValidationResult } from "./interfaces";
import { NextApiRequest, NextApiResponse } from "next";
import * as yup from "yup";
import { createMocks, RequestMethod } from "node-mocks-http";

export interface ValidationObjects {
  queryStringParameters?: yup.SchemaOf<object>;
  payload?: yup.SchemaOf<object>;
}

class ResponseHandler {
  static json<T>(
    res: NextApiResponse<T>,
    payload: T,
    statusCode: StatusCodes = StatusCodes.OK,
    // options?: ResponseOptions
  ): {
    payload: T;
    statusCode: StatusCodes;
  } {
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
    return { payload, statusCode };
  }

  static async handleRequest<T>(
    req: NextApiRequest,
    res: NextApiResponse,
    validationsBuilder: () => ValidationObjects,
    handler: any,
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
            queryStringParameters,
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
        headers: req.headers,
      },
      res,
      req,
    );
  }
}

class TestHandler {
  static async invokeLambda<T>(
    handlerPath: string,
    params?: {
      headers?: { [key: string]: string };
      queryString?: { [key: string]: string };
      payload?: any;
    },
  ): Promise<{
    payload: T;
    res: NextApiResponse;
    statusCode: StatusCodes;
  }> {
    const { req, res }: { req: any; res: any } = createMocks({
      method: handlerPath.split("-")[0].toUpperCase() as RequestMethod,
      query: params?.queryString,
      body: params?.payload,
    });
    req.headers = {
      "Content-Type": "application/json",
      ...(params?.headers ?? {}),
    };
    const data = await require(`../../endpoints/${handlerPath}/index`).default(
      req,
      res,
    );
    return { res, payload: data.payload, statusCode: data.statusCode };
  }
}

export { ResponseHandler, TestHandler };

export * from "./interfaces";

export const nextApiEndpointHandler =
  (route: string) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const endpoint = await import(
        `@/endpoints/${req.method.toLowerCase()}-${route}`
      );
      if (endpoint.default) {
        return endpoint.default(req, res);
      } else {
        return res.status(StatusCodes.MethodNotAllowed).json({});
      }
    } catch (e) {
      console.error(e);
      return res.status(StatusCodes.InternalServerError).json({});
    }
  };
