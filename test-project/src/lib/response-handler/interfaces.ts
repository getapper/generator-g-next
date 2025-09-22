import * as yup from "yup";

enum StatusCodes {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Reserved = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  RequestEntityTooLarge = 413,
  RequestURITooLong = 414,
  UnsupportedMediaType = 415,
  RequestedRangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  UnorderedCollection = 425,
  UpgradeRequired = 426,
  Unassigned = 427,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  BandwidthLimitExceeded = 509,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}

interface ResponseOptions {
  headers?: {
    [key: string]: string;
  };
}

interface HttpHeader {
  [key: string]: string;
}

interface Response {
  statusCode: number;
  body: string;
  headers?: HttpHeader;
  isBase64Encoded?: boolean;
}

type ErrorResponse = {
  message?: string;
};

type YupShapeByInterface<T> = {
  [K in keyof T]: any;
};

export interface ValidationResult {
  isValid: boolean;
  queryStringParametersErrors?: yup.ValidationError;
  payloadErrors?: yup.ValidationError;
  pathParametersErrors?: yup.ValidationError;
  message?: string;
}

export interface RequestI<Q, P> {
  validationResult: ValidationResult;
  queryStringParameters: Q;
  payload: P;
  headers?: { [name: string]: string };
}

export enum HttpMethods {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}

export { StatusCodes };
export type {
  HttpHeader,
  ResponseOptions,
  ErrorResponse,
  Response,
  YupShapeByInterface,
};
