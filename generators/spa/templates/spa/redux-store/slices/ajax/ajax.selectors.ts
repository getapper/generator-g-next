import { RootState } from "@/spas/<%= spaFolderName %>/redux-store";

export const getAjaxIsLoadingByApi = (api: string) => (state: RootState) =>
  state?.ajax?.isLoading[api];
