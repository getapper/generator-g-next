import {
  ActionCreatorWithPreparedPayload,
  createAction,
  PayloadActionCreator,
  PrepareAction,
} from "@reduxjs/toolkit";
import { Action } from "redux";

export enum HttpMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

interface ApiRequestPayloadBuilderParams {
  path: string;
  method: HttpMethod;
  body?: any;
  query?: any;
}

export interface ApiRequestPayloadBuilderOptions {
  requestDelay: number;
  absolutePath?: boolean;
  withCredentials?: boolean;
  showFeedbackOnError?: boolean;
}

export interface ApiRequestPayloadType<T> {
  params: ApiRequestPayloadBuilderParams;
  options?: ApiRequestPayloadBuilderOptions;
  prepareParams?: T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const apiRequestPayloadBuilder: <T>(
  ApiRequestPayloadBuilderParams,
  ApiRequestPayloadBuilderOptions,
  prepareParams?: T,
) => ApiRequestPayloadType<T> = (params, options?, prepareParams?) => ({
  params,
  options,
  prepareParams,
});

export interface ApiRequestAction<T> extends Action<string> {
  payload: ApiRequestPayloadType<T>;
  retry?: boolean;
}

interface ApiActionRequest<Args extends unknown[]>
  extends ActionCreatorWithPreparedPayload<
    Args,
    ApiRequestPayloadType<Args[0]>
    > {}

interface ApiSuccessData<T, U> {
  status: number;
  data: T;
  prepareParams: U;
}

export interface ApiFailData<U> {
  status: number;
  message: string;
  prepareParams: U;
}

export type ApiSuccessAction<T, U = any> = PayloadActionCreator<
  ApiSuccessData<T, U>
  >;

export type ApiFailAction<U = any> = PayloadActionCreator<ApiFailData<U>>;

export const apiActionBuilder = <ApiRequestParams, ApiResponseAction, ApiFailedResponseAction>(
  api: string,
  prepare: PrepareAction<ApiRequestPayloadType<ApiRequestParams>>,
) => ({
  api,
  request: createAction(`${api}/request`, prepare) as ApiActionRequest<
    [ApiRequestParams, ApiRequestPayloadBuilderOptions?]
    >,
  success: (createAction(`${api}/success`, (payload) => ({
    payload,
  })) as unknown) as ApiResponseAction,
  fail: (createAction(`${api}/fail`, (payload) => ({
    payload,
  })) as unknown) as ApiFailAction,
  cancel: createAction(`${api}/cancel`),
});
