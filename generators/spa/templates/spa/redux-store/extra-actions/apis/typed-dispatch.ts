import { AppDispatch } from "@/spas/<%= spaFolderName %>/redux-store";
import { ApiSuccessPayload, ExtractApiResponseData } from "./api-types";

// AJAX dispatch function that extracts response type from action creator
// Used for immediate API calls that bypass the saga flow (request => success/fail/cancel)
export async function ajaxDispatch<T extends { success: any; request: any }>(
  dispatch: AppDispatch,
  actionCreator: T,
  params: any,
  options?: any,
): Promise<ApiSuccessPayload<ExtractApiResponseData<T>>> {
  const result = await dispatch(actionCreator.request(params, options));
  return result as ApiSuccessPayload<ExtractApiResponseData<T>>;
}
