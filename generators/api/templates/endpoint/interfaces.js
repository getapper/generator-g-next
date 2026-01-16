module.exports = (
  apiNameCapital,
  urlParams,
  hasPayload,
  httpMethod
) => {
  const isPatch = httpMethod === "patch";
  
  return `import { ErrorResponse, RequestI${isPatch ? ", JsonPatchOperation" : ""} } from "@/lib/response-handler";

export namespace ${apiNameCapital}Api {
  export type QueryStringParameters = {${
    urlParams
      ? urlParams.map((p) => `\n    ${p}: string,`).join("\n") + "\n  "
      : ""
  }};${
  hasPayload
    ? isPatch
      ? `

  // JSON Patch RFC 6902 operations
  export type Payload = {
    operations: JsonPatchOperation[];
  };`
      : `

  export type Payload = {};`
    : ""
}

  export type SuccessResponse = {
    message?: string;
  };

  export type EndpointResponse = SuccessResponse | ErrorResponse;

  export interface Request extends RequestI<QueryStringParameters, ${
    hasPayload ? "Payload" : "null"
  }> {}
}
`;
};
