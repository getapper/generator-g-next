import { ApiSuccessAction } from "./api-builder";

// Utility type to extract the response data type from an API action
export type ExtractApiResponseType<T> = T extends ApiSuccessAction<infer R, any>
  ? R
  : never;

// Utility type to extract the response type from a dispatch call
export type DispatchResponseType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : never;

// Utility type for the success payload structure returned by dispatch
export interface ApiSuccessPayload<T> {
  status: number;
  data: T;
  prepareParams: any;
}

// Utility type for API action creators
export interface ApiActionCreator<Params, ResponseData, RequestParams> {
  api: string;
  request: (params: Params, options?: any) => any;
  success: ApiSuccessAction<ResponseData, RequestParams>;
  fail: any;
  cancel: any;
}

// Utility type to extract response data from API action creator
export type ExtractApiResponseData<T> = T extends ApiActionCreator<
  any,
  infer R,
  any
>
  ? R
  : never;
